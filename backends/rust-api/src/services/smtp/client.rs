// Config
use crate::config::CONFIG;

use lettre::message::{Mailbox, MultiPart};
// SMTP Imports
use lettre::{Message, SmtpTransport, Transport};
use lettre::transport::smtp::authentication::Credentials;

const CONTACT_TEMPLATE: &str = include_str!("templates/contact.html");

pub struct SMTPClient { 
    pub recipient_email: String,
    pub recipient_cc: String,
    pub smtp_user: String,
    pub smtp_pass: String,
    pub smtp_host: String,
    pub smtp_port: u16,
}

#[derive(Debug)]
pub enum SMTPError {
    ConnectionError,
    MailConstruct,
    SendError,
}

impl SMTPClient {
    pub fn new() -> Self {
        let cfg = CONFIG.get().expect("[Services.SMTP.new] !> CONFIG not initialized");

        // Check if we have all the needed creds
        if ![&cfg.smtp_user, &cfg.smtp_pass, &cfg.smtp_host, &cfg.recipient_email].iter().all(|c| !c.is_empty()) {
            panic!("[Services.SMTP.new] !> SMTP Credentials not found (required=[SMTP_USER,SMTP_PASS,SMTP_HOST,RECIPIENT_EMAIL])")
        }

        Self {
            recipient_email: cfg.recipient_email.clone(),
            recipient_cc: cfg.recipient_cc.clone(),
            smtp_user: cfg.smtp_user.clone(),
            smtp_pass: cfg.smtp_pass.clone(),
            smtp_host: cfg.smtp_host.clone(),
            smtp_port: cfg.smtp_port,
        }
    }

    /// This function return a valid SmtpTransport that
    /// is used to perform the "send" of the preapared
    /// email.
    pub fn get_conn_details(&self) -> Result<SmtpTransport, SMTPError> {
        let creds = Credentials::new(
            self.smtp_user.clone(),
            self.smtp_pass.clone()
        );

        // return the connection made
        let transport = 
            match SmtpTransport::relay(&self.smtp_host.to_string()) {
                Ok(t) => t,
                Err(e) => {
                    println!("[Services.SMTP.get_conn_details] !> Error performing connection... smtp_host=({}), err=({})", &self.smtp_host.to_string(), e.to_string());
                    return Err(SMTPError::ConnectionError)
                }
            };

        Ok(transport.credentials(creds).build())
    }

    /// Function used to send a specific email, the body of 
    /// the constructed email has to be HTML and be _______
    pub fn send_mail(&self, subject: String, multipart: MultiPart) -> Result<(), SMTPError> {
        let sender_address = self
            .smtp_user
            .parse()
            .map_err(|_| SMTPError::MailConstruct)?;

        let recipient_address = self
            .recipient_email
            .parse()
            .map_err(|_| SMTPError::MailConstruct)?;

        let mut builder = Message::builder()
            .from(Mailbox {
                name: Some("Vestta".to_string()),
                email: sender_address,
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

            let cc_address = cc_email
                .parse()
                .map_err(|_| SMTPError::MailConstruct)?;

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
            eprintln!(
                "[Services.SMTP.send_mail] Could not send email: {error:?}"
            );

            SMTPError::SendError
        })?;

        println!(
            "[Services.SMTP.send_mail] Mail sent successfully"
        );

        Ok(())
    }

    pub fn email_builder(&self, name: String, email: String, phone: String, subject: String, message: String) -> MultiPart {
        let escaped_name = self.escape_html(name.clone());
        let escaped_email = self.escape_html(email.clone());
        let escaped_phone = self.escape_html(phone.clone());
        let escaped_subject = self.escape_html(subject.clone());
        let escaped_message = self.escape_html(message.clone());

        let html_content = CONTACT_TEMPLATE
            .replace("{{subject}}", &escaped_subject)
            .replace("{{name}}", &escaped_name)
            .replace("{{email}}", &escaped_email)
            .replace("{{phone}}", &escaped_phone)
            .replace("{{message}}", &escaped_message);

        let plain_content = format!(
            "Nueva solicitud de contacto\n\n\
            Asunto: {subject}\n\
            Nombre: {name}\n\
            Email: {email}\n\
            Teléfono: {phone}\n\n\
            Mensaje:\n{message}"
        );

        MultiPart::alternative_plain_html(
            plain_content,
            html_content,
        )
    }

    pub fn escape_html(&self, value: String) -> String {
        value
            .replace('&', "&amp;")
            .replace('<', "&lt;")
            .replace('>', "&gt;")
            .replace('"', "&quot;")
            .replace('\'', "&#39;")
    }
    
    pub fn validate_email(email: &str) -> Result<Mailbox, &'static str> {
        let email = email.trim();


        if email.is_empty() || email.len() > 254 
        {
            return Err("Dirección de email inválida");
        }

        let (_, domain) = email
            .rsplit_once('@')
            .ok_or("Dirección de email inválida")?;

        if !domain.contains('.') {
            return Err("El dominio del email no es válido");
        }

        if domain.starts_with('.') || domain.ends_with('.') || domain.contains("..")
        {
            return Err("El dominio del email no es válido");
        }

        email
            .parse::<Mailbox>()
            .map_err(|_| "Dirección de email inválida")
    }
}