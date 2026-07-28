#[derive(Debug)]
pub enum SMTPError {
    MissingConfiguration,
    ConnectionError,
    MailConstruct,
    SendError,
}
