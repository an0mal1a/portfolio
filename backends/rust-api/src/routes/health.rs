use std::time::Duration;

use axum::{
    Json,
    extract::State,
    http::StatusCode,
    response::{IntoResponse, Response},
};
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
    OpenApiRouter::<AppState>::new()
        .routes(routes!(root_health_check))
        .routes(routes!(health_check))
        .routes(routes!(readiness_check))
}

#[utoipa::path(
    get,
    path = "/",
    tag = "Health",
    responses((status = 200, description = "El proceso HTTP está vivo", body = HealthResponse))
)]
/// Backwards-compatible liveness endpoint for existing deployments.
pub async fn root_health_check() -> Json<HealthResponse> {
    health_check().await
}

#[utoipa::path(
    get,
    path = "/health",
    tag = "Health",
    responses((status = 200, description = "El proceso HTTP está vivo", body = HealthResponse))
)]
/// Liveness probe. It deliberately avoids external dependencies so an
/// orchestrator never restarts the process just because PostgreSQL is briefly
/// unavailable.
pub async fn health_check() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok".to_string(),
        message: "Rust API is running".to_string(),
    })
}

#[utoipa::path(
    get,
    path = "/health/ready",
    tag = "Health",
    responses(
        (status = 200, description = "La API puede recibir tráfico", body = HealthResponse),
        (status = 503, description = "La API se está apagando o PostgreSQL no está disponible", body = HealthResponse)
    )
)]
/// Readiness probe. This is the endpoint intended for deployment healthchecks.
/// It becomes unavailable before graceful shutdown and verifies both database
/// pools, which are required by the public API.
pub async fn readiness_check(State(state): State<AppState>) -> Response {
    if !state.is_ready() {
        return unavailable("API is shutting down");
    }

    let reader = state.reader_db.clone();
    let writer = state.writer_db.clone();
    let (reader_result, writer_result) =
        tokio::join!(probe_database(reader), probe_database(writer),);

    if reader_result.is_ok() && writer_result.is_ok() {
        return Json(HealthResponse {
            status: "ok".to_string(),
            message: "Rust API is ready".to_string(),
        })
        .into_response();
    }

    unavailable("PostgreSQL is unavailable")
}

async fn probe_database(db: crate::core::DBClient) -> Result<(), ()> {
    tokio::time::timeout(Duration::from_secs(2), async move {
        let connection = db.get_db_connection().await.map_err(|_| ())?;
        connection
            .query_one("SELECT 1", &[])
            .await
            .map_err(|_| ())?;
        Ok(())
    })
    .await
    .map_err(|_| ())?
}

fn unavailable(message: &str) -> Response {
    (
        StatusCode::SERVICE_UNAVAILABLE,
        Json(HealthResponse {
            status: "unavailable".to_string(),
            message: message.to_string(),
        }),
    )
        .into_response()
}
