use axum::Json;
use serde::Serialize;
use utoipa::ToSchema;
use utoipa_axum::{router::OpenApiRouter, routes};

use crate::app_state::AppState;

#[derive(Serialize, ToSchema)]
pub struct HealthResponse {
    /// Estado actual del servicio.
    pub status: String,
    /// Mensaje legible para comprobaciones manuales.
    pub message: String,
}

pub fn router() -> OpenApiRouter<AppState> {
    OpenApiRouter::<AppState>::new().routes(routes!(health_check))
}

#[utoipa::path(
    get,
    path = "/",
    tag = "Health",
    responses(
        (status = 200, description = "El servicio está disponible", body = HealthResponse)
    )
)]
pub async fn health_check() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok".to_string(),
        message: "Server is running correctly (rust)!".to_string(),
    })
}
