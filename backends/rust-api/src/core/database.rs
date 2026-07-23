// Internal modules
use crate::core::defs::errors::DbConnectionError;
use crate::core::defs::modules::{DBClient, Permission};
use crate::config::CONFIG;

// DBModule
use postgres::{Client, NoTls};
use postgres::error::SqlState;

impl DBClient {
    /// this funcion creates and return 
    pub fn new(permission: Permission) -> Self {
        let cfg = CONFIG.get().expect("[Core.Database.new] !> CONFIG not initialized");

        // Check basic vars
        if ![&cfg.postgres_host, &cfg.postgres_db].iter().all(|c| !c.is_empty()) {
            panic!("[Core.Database.new] !> Database client has no host (required=[POSTGRES_HOST,POSTGRES_DB])")
        }

        match permission {
            Permission::READER => {
                // Check if we have all the needed creds
                if ![&cfg.postgres_reader_pass, &cfg.postgres_reader_pass].iter().all(|c| !c.is_empty()) {
                    panic!("[Core.Database.new] !> Database Reader credentials not found (required=[POSTGRES_READER_PASS,POSTGRES_READER_PASS])")
                }

                Self {
                    user: cfg.postgres_reader_pass.clone(),
                    pass: cfg.postgres_reader_pass.clone(),
                    host: cfg.postgres_host.clone(),
                    port: cfg.postgres_port,
                    db: cfg.postgres_db.clone()
                }
            }, 
            Permission::WRITER => {
                // Check if we have all the needed creds
                if ![&cfg.postgres_writer_user, &cfg.postgres_writer_pass].iter().all(|c| !c.is_empty()) {
                    panic!("[Core.Database.new] !> Database Writer credentials not found (required=[POSTGRES_WRITER_USER,POSTGRES_WRITER_PASS])")
                }

                Self {
                    user: cfg.postgres_writer_user.clone(),
                    pass: cfg.postgres_writer_pass.clone(),
                    host: cfg.postgres_host.clone(),
                    port: cfg.postgres_port,
                    db: cfg.postgres_db.clone()
                }
            },
        }
    }

    /// Helper function to retrive a formated connection string
    pub fn connection_string(&self) -> String {
        format!("user={} password={} host={} port={} dbname={}", self.user, self.pass, self.host, self.port, self.db)
    }

    pub fn get_db_connection(&self) -> Result<Client, DbConnectionError> {
        match Client::connect(self.connection_string().as_str(), NoTls) 
        {
            Ok(conn) => Ok(conn),
            Err(err) => {
                if let Some(db_err) = err.as_db_error() {
                    match db_err.code() {
                        &SqlState::INVALID_PASSWORD => {
                            println!("[SRV.DBCLIENT.GET_CONN] !> Incorrect DB Password");
                            Err(DbConnectionError::InvalidPassword)
                            
                        },
                        
                        &SqlState::INVALID_AUTHORIZATION_SPECIFICATION  => {
                            println!("[SRV.DBCLIENT.GET_CONN] !> Error in auth...");
                            Err(DbConnectionError::InvalidAuth)
                        },
                        _ => {
                            println!("[SRV.DBCLIENT.GET_CONN] !> UnHandled postgres error: {}", db_err);
                            Err(DbConnectionError::Other(err))
                        },
                    }
                
                } else {
                    // idw what to do here, so i just return conn error.
                    println!("[SRV.DBCLIENT.GET_CONN] !> Connection error: {}", err);
                    return Err(DbConnectionError::Other(err))
                }
            }
        }
    }
}