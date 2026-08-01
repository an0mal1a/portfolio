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
use tower_http::cors::{AllowOrigin, CorsLayer};
use utoipa_swagger_ui::SwaggerUi;

use config::{CONFIG, Config};

// Other modules
use axum::{
    self,
    http::{HeaderValue, Method, header},
    middleware,
};

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
    let cors = CorsLayer::new()
        .allow_origin(AllowOrigin::predicate(
            |origin: &HeaderValue, _request_parts| {
                let Ok(origin) = origin.to_str() else {
                    return false;
                };

                origin == "https://impablo.dev"
                    || origin == "http://localhost"
                    || origin.starts_with("http://localhost:")
            },
        ))
        .allow_methods([Method::GET, Method::POST])
        .allow_headers([header::CONTENT_TYPE]);

    let (api_router, openapi) = routes::router(contact_limiter).split_for_parts();

    let app = api_router
        .merge(SwaggerUi::new("/docs").url("/api-docs/openapi.json", openapi))
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
