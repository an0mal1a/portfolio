// SMTP
use crate::services::email::errors::SMTPError;
use crate::services::email::methods::smtp::SMTPClient;

// SMTP Imports
use lettre::message::{Mailbox, MultiPart};

const CONTACT_TEMPLATE: &str = include_str!("templates/contact.html");

pub struct EmailClient {
    // Google config
    pub smtp_client: Option<SMTPClient>,
}

impl EmailClient {
    pub fn new() -> Self {
        Self {
            smtp_client: Some(SMTPClient::new()),
        }
    }

    /// Function used to send a specific email, this function
    /// redirects the request to the selected services (Google +|| SMTP)
    pub fn send_mail(&self, subject: String, multipart: MultiPart) -> Result<(), SMTPError> {
        if self.smtp_client.is_some() {
            let client: &SMTPClient = self.smtp_client.as_ref().unwrap();
            client.send_mail(subject, multipart)
        } else {
            return Err(SMTPError::MissingConfiguration);
        }
    }

    pub fn email_builder(
        &self,
        name: String,
        email: String,
        phone: String,
        subject: String,
        message: String,
    ) -> MultiPart {
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

        MultiPart::alternative_plain_html(plain_content, html_content)
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

        if email.is_empty() || email.len() > 254 {
            return Err("Dirección de email inválida");
        }

        let (_, domain) = email
            .rsplit_once('@')
            .ok_or("Dirección de email inválida")?;

        if !domain.contains('.') {
            return Err("El dominio del email no es válido");
        }

        if domain.starts_with('.') || domain.ends_with('.') || domain.contains("..") {
            return Err("El dominio del email no es válido");
        }

        email
            .parse::<Mailbox>()
            .map_err(|_| "Dirección de email inválida")
    }
}
