use axum::{routing::get, Router, Json};
use serde_json::{Value, json};

use crate::app_state::AppState;

pub fn router() -> Router<AppState> {
    Router::<AppState>::new()
        .route("/", get(list_clients)) 
}

pub async fn list_clients() -> Json<Value> {
    return Json(json!({
        "status": "ok",
        "data": {}
    }))
}