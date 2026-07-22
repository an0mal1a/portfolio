use axum::{routing::get, Router, Json};

pub fn router() -> Router {
    Router::new()
        .route("/", get(contact)) 
}

pub async fn contact() {
    // POST 
}