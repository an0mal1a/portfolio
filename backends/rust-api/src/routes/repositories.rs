use axum::{Json, Router, extract::{Path, State}, http::StatusCode, routing::get};
use serde_json::{Value, json};

use crate::services::repositories::read::repos;
use crate::app_state::AppState;

pub fn router() -> Router<AppState> {
    Router::<AppState>::new()
        .route("/", get(list_repositories))
        .route("/{slug}", get(get_repository))
        // .route("/:slug", get(get_project))
}

pub async fn list_repositories(State(state): State<AppState>) -> (StatusCode, Json<Value>) {
    match repos::list_repositories(&state.reader_db).await {
        Ok(repos) => (
            StatusCode::OK,
            Json(
                json!({
                    "status": "ok",
                    "repos": repos
                })
            )
        ),
        Err(error) => {
            eprintln!("[Routes.Repositories.list_repositories] Database error: {error}");
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

pub async fn get_repository(State(state): State<AppState>, Path(slug): Path<String>) -> (StatusCode, Json<Value>) {

    match repos::get_repository(&state.reader_db, slug).await {
        Ok(Some(repo)) => (
            StatusCode::OK,
            Json(json!(
                {
                    "status": "ok",
                    "repo": repo
                }
            ))
        ),
        Ok(None) => (
            StatusCode::NOT_FOUND,
            Json(json!(
                {
                    "status": "ko",
                    "error": "repo_not_found"
                }
            ))
        ),
        Err(error) => {
            eprintln!("[Routes.Repositories.list_repositories] Database error: {error}");
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