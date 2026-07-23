use axum::{routing::get, Router, Json};
use serde_json::{Value, json};

pub fn router() -> Router {
    Router::new()
        .route("/", get(contact)) 
}

pub async fn contact() -> Json<Value> {
    // POST 
    return Json (
        json!(
            { "status": "ok" }
        )
    )
}