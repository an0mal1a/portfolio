use crate::core::{DBClient, defs::errors::DbConnectionError};
use crate::services::repositories::modules::Client;

pub async fn list_clients(db: &DBClient) -> Result<Vec<Client>, DbConnectionError> {
    let conn = db.get_db_connection().await?;

    let raw = conn.query("SELECT * FROM portfolio.clients", &[]).await?;

    let clients: Vec<Client> = raw
        .into_iter()
        .map(|c| Client {
            id: c.get("id"),
            name: c.get("name"),
            website: c.get("website"),
            logo_url: c.get("logo_url"),
            created_at: c.get("created_at"),
        })
        .collect();

    return Ok(clients);
}

// we wont need this probably
// pub async fn get_client(db: &DBClient, id: i64) -> Result<Option<Client>, DbConnectionError> {
//     let conn = db.get_db_connection().await?;

//     let Some(c) = conn
//         .query_opt(
//             "SELECT * FROM clients WHERE id = $1",
//             &[&id],
//         )
//         .await?
//     else {
//         return Ok(None)
//     };

//     let client: Client = Client {
//         id: c.get("id"),
//         name: c.get("name"),
//         website: c.get("website"),
//         logo_url: c.get("logo_url"),
//         created_at: c.get("created_at")
//     };

//     return Ok(Some(client))
// }
