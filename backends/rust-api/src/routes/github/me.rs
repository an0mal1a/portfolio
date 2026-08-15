use axum::{Json, http::StatusCode};
use serde_json::{Value, json};

use crate::{routes::openapi::ApiErrorResponse, routes::github::GHProfileResponse};


#[utoipa::path(
    get,
    path = "/me",
    tag = "Github profile",
    responses(
        (status = 200, description = "Resumen de perfil de github", body = GHProfileResponse),
        (status = 500, description = "Error al consultar la base de datos", body = ApiErrorResponse)
    )
)]
pub async fn me() -> (StatusCode, Json<Value>) {
    (
        StatusCode::OK,
        Json(json!({
            "status": "ok"
        }))
    )
}