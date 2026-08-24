use axum::extract::State;
use axum::{Json, http::StatusCode};
use serde::Serialize;
use serde_json::{Value, json};
use utoipa::ToSchema;

use crate::app_state::AppState;
use crate::{routes::openapi::ApiErrorResponse};

use crate::repositories::read::github::profile;
use crate::repositories::modules::GHProfile;

#[derive(Serialize, ToSchema)]
#[allow(dead_code)]
struct GHProfileResponse {
    status: String,
    profile: GHProfile,
}


#[utoipa::path(
    get,
    path = "/me",
    tag = "Github profile",
    responses(
        (status = 200, description = "Resumen de perfil de github", body = GHProfileResponse),
        (status = 500, description = "Error al consultar la base de datos", body = ApiErrorResponse)
    )
)]
pub async fn me(State(state): State<AppState>) -> (StatusCode, Json<Value>) {
    match profile::get_profile(&state.reader_db).await {
        Ok(Some(p)) => (
            StatusCode::OK,
            Json(json!({
                "status": "ok",
                "profile": p
            })),
        ), 
        Ok(None) => (
            StatusCode::NOT_FOUND,
            Json(json!({"status": "ko"})),
        ),
        Err(error) => {
            eprintln!("[Routes.Github.Profile.Me] Database error: {error}");
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
