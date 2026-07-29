mod app_state;
mod config;
mod core;
mod routes;
mod services;

use std::{net::SocketAddr, sync::Arc};

use crate::{
    app_state::AppState,
    core::{DBClient, Permission},
};
use services::rate_limiter::limiter::{RateLimitState, rate_limit_middleware};
use tower_http::cors::CorsLayer;

use config::{CONFIG, Config};

// Other modules
use axum::{self, Router, middleware};

#[tokio::main]
async fn main() {
    let config = Config::load().unwrap();
    CONFIG.set(config).expect("Config already initialized");

    // DB App state
    let reader_db =
        DBClient::new(Permission::READER).expect("Could not initialize reader database pool");
    let writer_db =
        DBClient::new(Permission::WRITER).expect("Could not initialize writer database pool");

    let state = AppState {
        reader_db,
        writer_db,
    };

    // Rate limit state
    let general_limiter = Arc::new(RateLimitState::per_minute(120));
    let contact_limiter = Arc::new(RateLimitState::per_minute(3));
    
    // Cors layer
    let allowed_origins = ["http://localhost:3000".parse().unwrap(), "https://impablo.dev".parse().unwrap()];
    let cors = CorsLayer::new().allow_origin(allowed_origins);

    let app = Router::new()
        .merge(routes::router(contact_limiter))
        .layer(middleware::from_fn_with_state(
            general_limiter,
            rate_limit_middleware,
        ))
        .layer(cors)
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();
    println!("Running on: http://localhost:8000");
    axum::serve(
        listener,
        app.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .await
    .unwrap();
}
