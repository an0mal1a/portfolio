use axum::{self, Json, Router, routing::get};
use serde_json::{Value, json};

pub mod services;
pub mod config;
pub mod core;

use config::{Config, CONFIG};

async fn health_check() -> Json<Value> {
    Json(json!({
        "status": "ok",
        "message": "Server is running correctly (rust)!"
    }))
}

#[tokio::main]
async fn main() {
    let config = Config::load().unwrap();
    CONFIG.set(config).expect("Config already initialized");

    let app: Router = Router::new()
        .route("/health", get(health_check));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();
    println!("Running on: http://localhost:8001");
    axum::serve(listener, app).await.unwrap();
}
