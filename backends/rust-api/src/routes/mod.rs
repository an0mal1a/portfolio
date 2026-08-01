use std::sync::Arc;

use crate::app_state::AppState;
use crate::services::rate_limiter::limiter::RateLimitState;
use axum::Router;

pub mod clients;
pub mod contact;
pub mod health;
pub mod projects;
pub mod repositories;

pub fn router(contact_limiter: Arc<RateLimitState>) -> Router<AppState> {
    Router::<AppState>::new()
        .nest("/repositories", repositories::router())
        .nest("/projects", projects::router())
        .nest("/clients", clients::router())
        .nest("/contact", contact::router(contact_limiter))
        .merge(health::router())
}
