use crate::app_state::AppState;
use axum::Router;

pub mod repositories;
pub mod projects;
pub mod clients;
pub mod contact;
pub mod health;

pub fn router() -> Router<AppState> {
    Router::<AppState>::new()
        .nest("/repositories", repositories::router())
        .nest("/projects", projects::router())
        .nest("/clients", clients::router())
        .nest("/contact", contact::router())
        .merge(health::router())
}