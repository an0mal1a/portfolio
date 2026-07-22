use axum::{routing::get, Router, Json};
use serde_json::{Value, json};

pub fn router() -> Router {
    Router::new()
        .route("/", get(health_check)) 
}

pub async fn health_check() -> Json<Value> {
    Json(json!({
        "status": "ok",
        "message": "Server is running correctly (rust)!"
    }))
}