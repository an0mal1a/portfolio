use axum::{Json, Router, extract::{Path, State}, routing::get};
use serde_json::{Value, json};

use crate::services::repos::read::projects;
use crate::app_state::AppState;


pub fn router() -> Router<AppState> {
    Router::<AppState>::new()
        .route("/", get(list_projects))
        .route("/{slug}", get(get_project))
        // .route("/:slug", get(get_project))
}

pub async fn list_projects(State(state): State<AppState>) -> Json<Value> {
    match projects::get_projects(&state.reader_db).await {
        Ok(projects) => {
            Json(json!({
                "staus": "ok",
                "projects": projects
            }))
        },
        Err(error) => {
            eprintln!("[Routes.Projects.get_projects] Database error: {error}");

            Json(json!({
                "status": "ko",
                "error": "database_error"
            }))
        }
    }

}

pub async fn get_project(Path(slug): Path<String>) -> Json<Value> {
    return Json(json!({
        "status": "ok",
        "data": {}
    }))
}