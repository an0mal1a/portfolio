use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use serde_json::{Value, json};
use utoipa::ToSchema;
use utoipa_axum::{router::OpenApiRouter, routes};

use crate::services::repositories::modules::Repo;
use crate::services::repositories::read::repos;
use crate::{app_state::AppState, routes::openapi::ApiErrorResponse};

#[derive(ToSchema)]
#[allow(dead_code)]
struct RepositoriesResponse {
    status: String,
    repos: Vec<Repo>,
}

#[derive(ToSchema)]
#[allow(dead_code)]
struct RepositoryResponse {
    status: String,
    repo: Repo,
}

pub fn router() -> OpenApiRouter<AppState> {
    OpenApiRouter::<AppState>::new()
        .routes(routes!(list_repositories))
        .routes(routes!(get_repository))
}

#[utoipa::path(
    get,
    path = "/",
    tag = "Repositories",
    responses(
        (status = 200, description = "Repositorios públicos", body = RepositoriesResponse),
        (status = 500, description = "Error al consultar la base de datos", body = ApiErrorResponse)
    )
)]
pub async fn list_repositories(State(state): State<AppState>) -> (StatusCode, Json<Value>) {
    match repos::list_repositories(&state.reader_db).await {
        Ok(repos) => (
            StatusCode::OK,
            Json(json!({
                "status": "ok",
                "repos": repos
            })),
        ),
        Err(error) => {
            eprintln!("[Routes.Repositories.list_repositories] Database error: {error}");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "status": "ko",
                    "error": "database_error"
                })),
            )
        }
    }
}

#[utoipa::path(
    get,
    path = "/{slug}",
    tag = "Repositories",
    params(("slug" = String, Path, description = "Slug del repositorio")),
    responses(
        (status = 200, description = "Repositorio encontrado", body = RepositoryResponse),
        (status = 404, description = "Repositorio no encontrado", body = ApiErrorResponse),
        (status = 500, description = "Error al consultar la base de datos", body = ApiErrorResponse)
    )
)]
pub async fn get_repository(
    State(state): State<AppState>,
    Path(slug): Path<String>,
) -> (StatusCode, Json<Value>) {
    match repos::get_repository(&state.reader_db, slug).await {
        Ok(Some(repo)) => (
            StatusCode::OK,
            Json(json!(
                {
                    "status": "ok",
                    "repo": repo
                }
            )),
        ),
        Ok(None) => (
            StatusCode::NOT_FOUND,
            Json(json!(
                {
                    "status": "ko",
                    "error": "repo_not_found"
                }
            )),
        ),
        Err(error) => {
            eprintln!("[Routes.Repositories.list_repositories] Database error: {error}");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "status": "ko",
                    "error": "database_error"
                })),
            )
        }
    }
}
