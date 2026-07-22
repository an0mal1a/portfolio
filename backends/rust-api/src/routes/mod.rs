use axum::Router;

pub mod repositories;
pub mod projects;
pub mod clients;
pub mod contact;
pub mod health;

pub fn router() -> Router {
    Router::new()
        .nest("/projects", projects::router())
        .nest("/repositories", repositories::router())
        .merge(clients::router())
        .merge(contact::router())
        .merge(health::router())
}