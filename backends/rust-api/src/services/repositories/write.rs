use crate::{
    core::{
        DBClient,
        defs::errors::DbConnectionError
    }, 
    routes::contact::Contact
};



pub async fn register_request(db: &DBClient, contact_data: &Contact) -> Result<(), DbConnectionError> {
    let conn = db.get_db_connection().await?;
    
    // Insert message
    conn
        .execute(
            "
            INSERT INTO contact.messages (
                name,
                email,
                phone,
                subject,
                message
            )
            VALUES ($1, $2, $3, $4, $5)
            ",
            &[
                &contact_data.name,
                &contact_data.email,
                &contact_data.phone,
                &contact_data.subject,
                &contact_data.message,
            ],
        )
        .await?;

    Ok(())
}