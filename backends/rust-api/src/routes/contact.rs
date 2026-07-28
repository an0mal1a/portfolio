use axum::{Json, Router, routing::post};
use serde::{Deserialize, Serialize};
use serde_json::{Value, json}; 

use crate::{app_state::AppState, services::email::client::EmailClient};

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

pub async fn contact(Json(contact_data): Json<Contact>) -> Json<Value> {
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

    // Store message in DB

    // Send message    
    let email = EmailClient::new();
    let multipart = email.email_builder(
        contact_data.name, 
        contact_data.email, 
        contact_data.phone, 
        contact_data.subject.clone(), 
        contact_data.message
    );


    match email.send_mail(contact_data.subject, multipart) {
        Ok(()) => Json (json!({ "status": "ok" })),
        Err(e) => {
            println!("[ROUTES.Contact.Contact()] !> Error sending email: {e:?}");
            Json (json!({ "status": "ko" }))
        }

    }


    
}