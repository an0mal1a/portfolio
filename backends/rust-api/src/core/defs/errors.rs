use deadpool_postgres::{
    BuildError,
    PoolError,
};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum DbConnectionError {
    #[error("database configuration is not initialized")]
    ConfigNotInitialized,

    #[error("database configuration is incomplete")]
    MissingConfiguration,

    #[error("database credentials are missing")]
    MissingCredentials,

    #[error("could not build database pool: {0}")]
    PoolBuild(#[from] BuildError),

    #[error("could not retrieve a database connection: {0}")]
    PoolConnection(#[from] PoolError),
}