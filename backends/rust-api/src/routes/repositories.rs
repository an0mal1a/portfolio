use axum::{Json, Router, extract::Path, routing::get};
use serde_json::{Value, json};

pub fn router() -> Router {
    Router::new()
        .route("/", get(list_repositories))
        .route("/{slug}", get(get_repository))
        // .route("/:slug", get(get_project))
}

pub async fn list_repositories() -> Json<Value> {
    return Json(json!({
        "status": "ok",
        "data": []
    }))
}

pub async fn get_repository(Path(slug): Path<String>) -> Json<Value> {
    return Json(json!({
        "status": "ok",
        "data": {}
    }))
}