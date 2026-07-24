
mod app_state;º
mod services;
mod config;
mod routes;
mod core;

// Config
use config::{Config, CONFIG};

// Other modules
use axum::{self, Router};

use crate::app_state::AppState;
use crate::core::{
    DBClient,
    Permission,
};

#[tokio::main]
async fn main() {
    let config = Config::load().unwrap();
    CONFIG.set(config).expect("Config already initialized");

    let reader_db = DBClient::new(Permission::READER).expect("Could not initialize reader database pool");
    let writer_db = DBClient::new(Permission::WRITER).expect("Could not initialize writer database pool");

    let state = AppState {
        reader_db,
        writer_db,
    };

    let app = Router::new()
        .merge(routes::router())
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();
    println!("Running on: http://localhost:8001");
    axum::serve(listener, app).await.unwrap();
}
