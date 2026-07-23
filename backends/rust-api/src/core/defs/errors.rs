pub enum DbConnectionError {
    InvalidPassword,
    InvalidAuth,
    Other(postgres::Error)
}