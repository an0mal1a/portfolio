use axum::{routing::get, Router, Json};
use serde_json::{Value, json};

pub fn router() -> Router {
    Router::new()
        .route("/", get(list_clients)) 
}

pub async fn list_clients() -> Json<Value> {
    return Json(json!({
        "status": "ok",
        "data": {}
    }))
}