
pub mod services;
pub mod config;
pub mod routes;
pub mod core;

// Config
use config::{Config, CONFIG};

// Other modules
use axum::{self, Router};


#[tokio::main]
async fn main() {
    let config = Config::load().unwrap();
    CONFIG.set(config).expect("Config already initialized");

    let app: Router = routes::router();

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();
    println!("Running on: http://localhost:8001");
    axum::serve(listener, app).await.unwrap();
}
