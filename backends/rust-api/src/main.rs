use axum::{self, Json, Router, routing::get};
use serde_json::{Value, json};

async fn health_check() -> Json<Value> {
    Json(json!({
        "status": "ok",
        "message": "Server is running correctly (rust)!"
    }))
}

#[tokio::main]
async fn main() {
    let app: Router = Router::new()
        .route("/", get(health_check));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();
    println!("Running on: http://localhost:8001");
    axum::serve(listener, app).await.unwrap();
}
