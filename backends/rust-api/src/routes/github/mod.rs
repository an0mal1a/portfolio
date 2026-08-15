pub mod repositories;
pub mod me;

use utoipa_axum::{router::OpenApiRouter, routes};

use crate::app_state::AppState;

pub fn router() -> OpenApiRouter<AppState> {
    OpenApiRouter::<AppState>::new()
        .routes(routes!(crate::routes::github::me::me))
        .nest("/repositories", repositories::router())
}