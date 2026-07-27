use axum::{Json, Router, extract::{Path, State}, http::StatusCode, routing::get};
use serde_json::{Value, json};

use crate::services::repos::read::projects;
use crate::app_state::AppState;


pub fn router() -> Router<AppState> {
    Router::<AppState>::new()
        .route("/", get(list_projects))
        .route("/{slug}", get(get_project))
        // .route("/:slug", get(get_project))
}

pub async fn list_projects(State(state): State<AppState>) -> (StatusCode, Json<Value>) {
    match projects::get_projects(&state.reader_db).await {
        Ok(projects) => (
            StatusCode::OK,
            Json(json!({
                "status": "ok",
                "projects": projects
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

pub async fn get_project(Path(slug): Path<String>) -> Json<Value> {
    return Json(json!({
        "status": "ok",
        "data": {}
    }))
}