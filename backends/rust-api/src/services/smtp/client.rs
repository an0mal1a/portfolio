// Config
use crate::config::CONFIG;

use lettre::message::{Mailbox, MultiPart, SinglePart};
use lettre::message::header::ContentType;
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
        // Prepare email
        let mut builder = Message::builder()
            .from(Mailbox {
                name: Some("Portfolio".to_string()),
                email: self.smtp_user.clone().parse().unwrap(),
            })


            .to(Mailbox {
                name: Some("Portfolio".to_string()),
                email: self.recipient_email.clone().parse().unwrap(),
            });

        // If there is a CC env, fill it
        for cc_email in self.recipient_cc.split(",") {
            let cc_email = cc_email.trim();
            if !cc_email.is_empty() {
                builder = builder.cc(Mailbox {
                    name: Some("Portfolio".to_string()),
                    email: cc_email.parse().unwrap(),
                })
            }
        }

        // Finish the email build
        let email = builder
            .subject(format!("New client request - {}", subject))
            .header(ContentType::TEXT_HTML)
            .multipart(multipart)
            .map_err(|_| SMTPError::MailConstruct)?;

        // Get conn & send
        let mailer = self.get_conn_details()?;
        match mailer.send(&email) {
            Ok(_) => {
                println!("[Services.SMTP.send_mail] > Mail sended successfully");
                return Ok(())
            }
            Err(e) => {
                println!("[Services.SMTP.send_mail] !> Could not send email: {e:?}");
                return Err(SMTPError::SendError)
            }
        }
    }

    pub fn email_builder(&self, name: String, email: String, phone: String, subject: String, message: String) -> MultiPart {
        let html_content = CONTACT_TEMPLATE
            .replace("{{subject}}", &self.escape_html(subject))
            .replace("{{name}}", &self.escape_html(name))
            .replace("{{email}}", &self.escape_html(email))
            .replace("{{phone}}", &self.escape_html(phone))
            .replace("{{message}}", &self.escape_html(message)); 

        // Construct multipart
        MultiPart::alternative().singlepart(SinglePart::html(html_content.to_string()))
    }

    pub fn escape_html(&self, value: String) -> String {
        value
            .replace('&', "&amp;")
            .replace('<', "&lt;")
            .replace('>', "&gt;")
            .replace('"', "&quot;")
            .replace('\'', "&#39;")
    }
}