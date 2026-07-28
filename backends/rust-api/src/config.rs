use std::sync::OnceLock;
use std::env;

pub static CONFIG: OnceLock<Config> = OnceLock::new();

#[derive(Debug)]
pub struct Config {
    pub postgres_writer_user: String,
    pub postgres_writer_pass: String,
    pub postgres_reader_user: String,
    pub postgres_reader_pass: String,

    pub postgres_host: String,
    pub postgres_db: String,
    pub postgres_port: u16,

    pub recipient_email: String,
    pub recipient_cc: String,

    pub smtp_user: String,
    pub smtp_pass: String,
    pub smtp_host: String, 
    pub from_name: String, 
    pub from_email: String, 
}

impl Config {
    pub fn load() -> Result<Self, String> {
        Ok(Self { 
            // PostgreSQL
            postgres_writer_user: env::var("SYNC_WRITER_USER").unwrap_or_default(),
            postgres_writer_pass: env::var("SYNC_WRITER_PASSWORD").unwrap_or_default(),
            postgres_reader_user: env::var("API_READER_USER").unwrap_or_default(),
            postgres_reader_pass: env::var("API_READER_PASSWORD").unwrap_or_default(),

            postgres_host: env::var("POSTGRES_HOST").unwrap_or("db".to_string()),
            postgres_port: env::var("POSTGRES_PORT").ok().and_then(|v| v.parse::<u16>().ok()).unwrap_or(5432),
            postgres_db:   env::var("POSTGRES_DB").unwrap_or("portfolio".to_string()),

            // SMTP Config
            recipient_email: env::var("RECIPIENT_EMAIL").unwrap_or_default(),
            recipient_cc: env::var("RECIPIENT_CC").unwrap_or_default(),
 
            smtp_user: env::var("SMTP_USER").unwrap_or_default(),
            smtp_pass: env::var("SMTP_PASS").unwrap_or_default(),
            smtp_host: env::var("SMTP_HOST").unwrap_or_default(), 
            from_name: env::var("FROM_NAME").unwrap_or_default(), 
            from_email: env::var("FROM_EMAIL").unwrap_or_default(), 
        })
    }
}