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
    match projects::list_projects(&state.reader_db).await {
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

pub async fn get_project(State(state): State<AppState>, Path(slug): Path<String>) -> (StatusCode, Json<Value>) {
    match projects::get_project(&state.reader_db, slug).await {
        Ok(Some(project)) => (
            StatusCode::OK,
            Json(json!({
                "status": "ok",
                "project": project,
            }))
        ),
        Ok(None) => (
            StatusCode::NOT_FOUND,
            Json(json!({
                "status": "ko",
                "error": "project_not_found",
            }))
        ),
        Err(error) => {
            eprintln!("[Routes.Projects.get_project] Database error: {error}");

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