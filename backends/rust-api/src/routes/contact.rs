use std::sync::Arc;

use axum::{Json, extract::State, middleware};
use serde::{Deserialize, Serialize};
use serde_json::{Value, json};
use utoipa::ToSchema;
use utoipa_axum::{router::OpenApiRouter, routes};

use crate::{
    app_state::AppState,
    services::{
        email::client::EmailClient,
        rate_limiter::limiter::{RateLimitState, rate_limit_middleware},
    },
    repositories::write,
};

// Contact model
#[derive(Debug, Clone, Deserialize, Serialize, ToSchema)]
pub struct Contact {
    pub name: String,
    pub email: String,

    pub subject: String,
    pub message: String,

    #[serde(default)]
    pub phone: String,
}

#[derive(ToSchema)]
#[allow(dead_code)]
struct ContactResponse {
    status: String,
    error: Option<String>,
}

pub fn router(limiter_state: Arc<RateLimitState>) -> OpenApiRouter<AppState> {
    OpenApiRouter::<AppState>::new()
        .routes(routes!(contact))
        .route_layer(middleware::from_fn_with_state(
            limiter_state,
            rate_limit_middleware,
        ))
}

#[utoipa::path(
    post,
    path = "/",
    tag = "Contact",
    request_body = Contact,
    responses(
        (status = 200, description = "Resultado del envío. Si falla, `error` indica la causa.", body = ContactResponse),
        (status = 422, description = "El cuerpo JSON no cumple el formato esperado")
    )
)]
pub async fn contact(
    State(state): State<AppState>,
    Json(contact_data): Json<Contact>,
) -> Json<Value> {
    // Make sure data is correct
    match EmailClient::validate_email(contact_data.email.as_str()) {
        Ok(_) => (),
        Err(_) => {
            return Json(json!({
                "status": "ko",
                "error": "invalid_mail"
            }));
        }
    }

    // Prepare mail
    let email = EmailClient::new();
    let multipart = email.email_builder(
        contact_data.name.clone(),
        contact_data.email.clone(),
        contact_data.phone.clone(),
        contact_data.subject.clone(),
        contact_data.message.clone(),
    );

    // Send & Store message (or message try to db)
    // lettre performs blocking DNS/TCP/TLS/SMTP I/O. Keep it off Tokio's
    // async worker threads so a slow SMTP server cannot stall other requests.
    let subject = contact_data.subject.clone();
    let send_result =
        tokio::task::spawn_blocking(move || email.send_mail(subject, multipart)).await;

    match send_result {
        Ok(Ok(())) => match write::register_request(&state.writer_db, &contact_data).await {
            Ok(()) => Json(json!({
                "status": "ok",
            })),
            Err(error) => {
                eprintln!("[Routes.Contact.contact] Error storing contact request: {error:?}");

                Json(json!({
                    "status": "ko",
                    "error": "database_error",
                }))
            }
        },
        Ok(Err(error)) => {
            eprintln!("[Routes.Contact.contact] Error sending email: {error:?}");
            let _ = write::register_request(&state.writer_db, &contact_data).await;

            Json(json!({
                "status": "ko",
                "error": "email_error",
            }))
        }
        Err(error) => {
            eprintln!("[Routes.Contact.contact] SMTP worker failed: {error:?}");
            let _ = write::register_request(&state.writer_db, &contact_data).await;

            Json(json!({
                "status": "ko",
                "error": "email_error",
            }))
        }
    }
}
