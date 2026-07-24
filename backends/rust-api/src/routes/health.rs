use axum::{routing::get, Router, Json};
use serde_json::{Value, json};

use crate::app_state::AppState;

pub fn router() -> Router<AppState> {
    Router::<AppState>::new()
        .route("/", get(health_check)) 
}

pub async fn health_check() -> Json<Value> {
    Json(json!({
        "status": "ok",
        "message": "Server is running correctly (rust)!"
    }))
}