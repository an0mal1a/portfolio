// Internal modules
use crate::config::CONFIG;
use crate::core::defs::errors::DbConnectionError;
use crate::core::{DBClient, Permission};

use deadpool_postgres::{Manager, ManagerConfig, Object, Pool, RecyclingMethod, Runtime};
use tokio_postgres::{Config as PostgresConfig, NoTls};

// DBModule
// use postgres::{Client, NoTls};
// use postgres::error::SqlState;

// pub user: String,
// pub pass: String,
// pub host: String,
// pub port: u16,
// pub db: String,

impl DBClient {
    /// this funcion creates and return
    pub fn new(permission: Permission) -> Result<Self, DbConnectionError> {
        let cfg = CONFIG
            .get()
            .expect("[Core.Database.new] !> CONFIG not initialized");

        // Check basic vars
        if ![&cfg.postgres_host, &cfg.postgres_db]
            .iter()
            .all(|c| !c.is_empty())
        {
            panic!(
                "[Core.Database.new] !> Database client has no host (required=[POSTGRES_HOST,POSTGRES_DB])"
            )
        }

        let (user, password) = match permission {
            Permission::READER => {
                if cfg.postgres_reader_user.is_empty() || cfg.postgres_reader_pass.is_empty() {
                    return Err(DbConnectionError::MissingCredentials);
                }

                (
                    cfg.postgres_reader_user.as_str(),
                    cfg.postgres_reader_pass.as_str(),
                )
            }

            Permission::WRITER => {
                if cfg.postgres_writer_user.is_empty() || cfg.postgres_writer_pass.is_empty() {
                    return Err(DbConnectionError::MissingCredentials);
                }

                (
                    cfg.postgres_writer_user.as_str(),
                    cfg.postgres_writer_pass.as_str(),
                )
            }
        };

        let mut pg_config = PostgresConfig::new();

        pg_config
            .host(&cfg.postgres_host)
            .port(cfg.postgres_port)
            .dbname(&cfg.postgres_db)
            .user(user)
            .password(password);

        let manager_config = ManagerConfig {
            recycling_method: RecyclingMethod::Fast,
        };

        let manager = Manager::from_config(pg_config, NoTls, manager_config);

        let pool = Pool::builder(manager)
            .max_size(16)
            .runtime(Runtime::Tokio1)
            .build()
            .map_err(DbConnectionError::PoolBuild)?;

        Ok(Self { pool })
    }

    pub async fn get_db_connection(&self) -> Result<Object, DbConnectionError> {
        Ok(self.pool.get().await?)
    }
}
