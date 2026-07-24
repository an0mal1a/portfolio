use crate::core::{DBClient, defs::errors::DbConnectionError};

pub async fn get_projects(db: &DBClient) -> Result<Vec<String>, DbConnectionError> {
    let conn = db.get_db_connection().await?;
    
    // Exeute sql

    
    return Ok(vec![])
}