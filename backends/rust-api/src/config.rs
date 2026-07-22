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
}

impl Config {
    pub fn load() -> Result<Self, String> {
        Ok(Self { 
            postgres_writer_user: env::var("SYNC_WRITER_USER").unwrap_or("writer".to_string()),
            postgres_writer_pass: env::var("SYNC_WRITER_PASSWORD").unwrap_or("writer".to_string()),
            postgres_reader_user: env::var("API_READER_USER").unwrap_or("reader".to_string()),
            postgres_reader_pass: env::var("API_READER_PASSWORD").unwrap_or("reader".to_string()),
            postgres_host: env::var("POSTGRES_HOST").unwrap_or("db".to_string()),
            postgres_port: env::var("POSTGRES_PORT").ok().and_then(|v| v.parse::<u16>().ok()).unwrap_or(5432),
            postgres_db: env::var("POSTGRES_DB").unwrap_or("portfolio".to_string()),
        })
    }
}