use serde_json::{Value, json};

use axum::{Json, extract::State, http::StatusCode};
use utoipa::ToSchema;
use utoipa_axum::{router::OpenApiRouter, routes};

use crate::{
    app_state::AppState,
    routes::openapi::ApiErrorResponse,
    repositories::{modules::Client, read::clients},
};

#[derive(ToSchema)]
#[allow(dead_code)]
struct ClientsResponse {
    status: String,
    clients: Vec<Client>,
}

pub fn router() -> OpenApiRouter<AppState> {
    OpenApiRouter::<AppState>::new().routes(routes!(list_clients))
}

#[utoipa::path(
    get,
    path = "/",
    tag = "Clients",
    responses(
        (status = 200, description = "Clientes del portfolio", body = ClientsResponse),
        (status = 500, description = "Error al consultar la base de datos", body = ApiErrorResponse)
    )
)]
pub async fn list_clients(State(state): State<AppState>) -> (StatusCode, Json<Value>) {
    match clients::list_clients(&state.reader_db).await {
        Ok(c) => (
            StatusCode::OK,
            Json(json!({
                "status": "ok",
                "clients": c
            })),
        ),
        Err(error) => {
            eprintln!("[Routes.Projects.list_projects] Database error: {error}");

            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "status": "ko",
                    "error": "database_error"
                })),
            )
        }
    }
}
