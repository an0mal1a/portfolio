// Config
use crate::config::CONFIG;
use crate::services::email::errors::SMTPError;
use std::time::Duration;

// SMTP Imports
use lettre::message::{Mailbox, MultiPart};
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Address, Message, SmtpTransport, Transport};

pub struct SMTPClient {
    // SMTP Config
    pub host: String,
    pub username: String,
    pub password: String,
    pub port: u16,
    pub from_email: String,
    pub from_name: String,
    pub recipient_email: String,
    pub recipient_cc: String,
}

impl SMTPClient {
    pub fn new() -> Self {
        let cfg = CONFIG
            .get()
            .expect("[Services.SMTP.new] !> CONFIG not initialized");

        // Check if we have all the needed creds
        if ![
            &cfg.smtp_user,
            &cfg.smtp_pass,
            &cfg.smtp_host,
            &cfg.recipient_email,
        ]
        .iter()
        .all(|c| !c.is_empty())
        {
            panic!(
                "[Services.SMTP.new] !> SMTP Credentials not found (required=[SMTP_USER,SMTP_PASS,SMTP_HOST,RECIPIENT_EMAIL])"
            )
        }

        Self {
            host: cfg.smtp_host.clone(),
            username: cfg.smtp_user.clone(),
            password: cfg.smtp_pass.clone(),
            port: cfg.smtp_port,
            from_email: cfg.from_email.clone(),
            from_name: cfg.from_name.clone(),
            recipient_email: cfg.recipient_email.clone(),
            recipient_cc: cfg.recipient_cc.clone(),
        }
    }

    /// This function return a valid SmtpTransport that
    /// is used to perform the "send" of the preapared
    /// email.
    pub fn get_conn_details(&self) -> Result<SmtpTransport, SMTPError> {
        let creds = Credentials::new(self.username.clone(), self.password.clone());

        // return the connection made
        let transport = match SmtpTransport::relay(&self.host) {
            Ok(t) => t,
            Err(e) => {
                println!(
                    "[Services.SMTP.get_conn_details] !> Error performing connection... smtp_host=({}), err=({})",
                    &self.host.to_string(),
                    e.to_string()
                );
                return Err(SMTPError::ConnectionError);
            }
        };

        Ok(transport
            .port(self.port)
            .credentials(creds)
            .timeout(Some(Duration::from_secs(15)))
            .build())
    }

    /// Function used to send a specific email, the body of
    /// the constructed email has to be HTML and be _______
    pub fn send_mail(&self, subject: String, multipart: MultiPart) -> Result<(), SMTPError> {
        let recipient_address: Address = self
            .recipient_email
            .parse()
            .map_err(|_| SMTPError::MailConstruct)?;

        let from_address: Address = self
            .from_email
            .parse()
            .map_err(|_| SMTPError::MailConstruct)?;

        let mut builder = Message::builder()
            .from(Mailbox {
                name: Some(self.from_name.to_string()),
                email: from_address,
            })
            .to(Mailbox {
                name: None,
                email: recipient_address,
            });

        for cc_email in self.recipient_cc.split(',') {
            let cc_email = cc_email.trim();

            if cc_email.is_empty() {
                continue;
            }

            let cc_address = cc_email.parse().map_err(|_| SMTPError::MailConstruct)?;

            builder = builder.cc(Mailbox {
                name: None,
                email: cc_address,
            });
        }

        let email = builder
            .subject(format!("Nueva solicitud de contacto: {subject}"))
            .multipart(multipart)
            .map_err(|_| SMTPError::MailConstruct)?;

        let mailer = self.get_conn_details()?;

        mailer.send(&email).map_err(|error| {
            eprintln!("[Services.SMTP.send_mail] Could not send email: {error:?}");

            SMTPError::SendError
        })?;

        println!("[Services.SMTP.send_mail] Mail sent successfully");

        Ok(())
    }
}
