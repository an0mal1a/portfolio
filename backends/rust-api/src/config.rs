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

    pub use_smtp: bool,
    pub smtp_user: String,
    pub smtp_pass: String,
    pub smtp_host: String,
    pub smtp_port: u16,
    
    pub use_google: bool,
    pub google_mail: String,
    pub google_app_pass: String,
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
 
            use_smtp:  env::var("USE_SMTP").ok().and_then(|v| v.parse::<bool>().ok()).unwrap_or(true),
            smtp_user: env::var("SMTP_USER").unwrap_or_default(),
            smtp_pass: env::var("SMTP_PASS").unwrap_or_default(),
            smtp_host: env::var("SMTP_HOST").unwrap_or_default(),
            smtp_port: env::var("SMTP_PORT").ok().and_then(|v| v.parse::<u16>().ok()).unwrap_or(454),
            
            use_google:      env::var("USE_GOOGLE").ok().and_then(|v| v.parse::<bool>().ok()).unwrap_or(false),
            google_mail:     env::var("GOOGLE_MAIL").unwrap_or_default(),
            google_app_pass: env::var("GOOGLE_APP_PASS").unwrap_or_default(),
        })
    }
}