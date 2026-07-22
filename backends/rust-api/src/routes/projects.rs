use axum::{routing::get, Router, Json};
use serde_json::{Value, json};

pub fn router() -> Router {
    Router::new()
        .route("/", get(list_projects))
        .route("/{slug}", get(get_project))
        // .route("/:slug", get(get_project))
}

pub async fn list_projects() -> Json<Value> {
    return Json(json!({
        "status": "ok",
        "data": []
    }))
}

pub async fn get_project(repo_id: u32) -> Json<Value> {
    return Json(json!({
        "status": "ok",
        "data": {}
    }))
}