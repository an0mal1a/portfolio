use std::sync::Arc;

use crate::app_state::AppState;
use crate::services::rate_limiter::limiter::RateLimitState;
use utoipa::OpenApi;
use utoipa_axum::router::OpenApiRouter;

pub mod clients;
pub mod contact;
pub mod health;
pub mod openapi;
pub mod projects;
pub mod repositories;
pub mod system;

#[derive(OpenApi)]
#[openapi(
    info(
        title = "Portfolio API",
        version = "0.1.0",
        description = "API pública que alimenta el portfolio de Pablo."
    ),
    tags(
        (name = "Health", description = "Estado del servicio"),
        (name = "Repositories", description = "Repositorios públicos"),
        (name = "Projects", description = "Proyectos publicados"),
        (name = "Clients", description = "Clientes del portfolio"),
        (name = "Contact", description = "Envío de mensajes de contacto"),
        (name = "System", description = "Estado operativo de la plataforma")
    )
)]
struct ApiDoc;

pub fn router(contact_limiter: Arc<RateLimitState>) -> OpenApiRouter<AppState> {
    OpenApiRouter::<AppState>::with_openapi(ApiDoc::openapi())
        .nest("/repositories", repositories::router())
        .nest("/projects", projects::router())
        .nest("/clients", clients::router())
        .nest("/contact", contact::router(contact_limiter))
        .merge(health::router())
        .merge(system::router())
}
