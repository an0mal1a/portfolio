use axum::{Json, Router, extract::State, routing::post};
use serde::{Deserialize, Serialize};
use serde_json::{Value, json}; 

use crate::{
    app_state::AppState,
    services::{
        email::client::EmailClient,
        repositories::write
    }
};

// Contact model    
#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Contact {
    pub name: String,
    pub email: String,
    
    pub subject: String,
    pub message: String,

    #[serde(default)]
    pub phone: String,
}

pub fn router() -> Router<AppState> {
    Router::<AppState>::new()
        .route("/", post(contact)) 
}

pub async fn contact(State(state): State<AppState>, Json(contact_data): Json<Contact>) -> Json<Value> {
    // Make sure data is correct
    match EmailClient::validate_email(contact_data.email.as_str()){
        Ok(_) => (),
        Err(_) => {
            return Json(json!({
                "status": "ko",
                "error": "invalid_mail"
            }))
        }
    }

    // Prepare mail
    let email = EmailClient::new();
    let multipart = email.email_builder(
        contact_data.name.clone(), 
        contact_data.email.clone(), 
        contact_data.phone.clone(), 
        contact_data.subject.clone(), 
        contact_data.message.clone()
    );

    // Send & Store message (or message try to db)
    match email.send_mail(contact_data.subject.clone(), multipart) {
        Ok(()) => {
            match write::register_request(&state.writer_db, &contact_data).await
            {
                Ok(()) => {
                    Json(json!({
                        "status": "ok",
                    }))
                }
                Err(error) => {
                    eprintln!(
                        "[Routes.Contact.contact] Error storing contact request: {error:?}"
                    );

                    Json(json!({
                        "status": "ko",
                        "error": "database_error",
                    }))
                }
            }
        }
        Err(error) => {
            eprintln!("[Routes.Contact.contact] Error sending email: {error:?}");
            let _ = write::register_request(&state.writer_db, &contact_data).await;

            Json(json!({
                "status": "ko",
                "error": "email_error",
            }))
        }
    }


    
}