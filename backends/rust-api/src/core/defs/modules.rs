pub struct DBClient { 
    pub user: String,
    pub pass: String,
    pub host: String,
    pub port: u16,
    pub db: String,
}

pub enum Permission {
    WRITER,
    READER
}