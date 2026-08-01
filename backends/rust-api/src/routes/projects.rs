use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use serde_json::{Value, json};
use utoipa::ToSchema;
use utoipa_axum::{router::OpenApiRouter, routes};

use crate::services::repositories::modules::Project;
use crate::services::repositories::read::projects;
use crate::{app_state::AppState, routes::openapi::ApiErrorResponse};

#[derive(ToSchema)]
#[allow(dead_code)]
struct ProjectsResponse {
    status: String,
    projects: Vec<Project>,
}

#[derive(ToSchema)]
#[allow(dead_code)]
struct ProjectResponse {
    status: String,
    project: Project,
}

pub fn router() -> OpenApiRouter<AppState> {
    OpenApiRouter::<AppState>::new()
        .routes(routes!(list_projects))
        .routes(routes!(get_project))
}

#[utoipa::path(
    get,
    path = "/",
    tag = "Projects",
    responses(
        (status = 200, description = "Proyectos publicados", body = ProjectsResponse),
        (status = 500, description = "Error al consultar la base de datos", body = ApiErrorResponse)
    )
)]
pub async fn list_projects(State(state): State<AppState>) -> (StatusCode, Json<Value>) {
    match projects::list_projects(&state.reader_db).await {
        Ok(projects) => (
            StatusCode::OK,
            Json(json!({
                "status": "ok",
                "projects": projects
            })),
        ),
        Err(error) => {
            eprintln!("[Routes.Projects.list_projects] Database error: {error}");

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
    tag = "Projects",
    params(("slug" = String, Path, description = "Slug del proyecto")),
    responses(
        (status = 200, description = "Proyecto encontrado", body = ProjectResponse),
        (status = 404, description = "Proyecto no encontrado", body = ApiErrorResponse),
        (status = 500, description = "Error al consultar la base de datos", body = ApiErrorResponse)
    )
)]
pub async fn get_project(
    State(state): State<AppState>,
    Path(slug): Path<String>,
) -> (StatusCode, Json<Value>) {
    match projects::get_project(&state.reader_db, slug).await {
        Ok(Some(project)) => (
            StatusCode::OK,
            Json(json!({
                "status": "ok",
                "project": project,
            })),
        ),
        Ok(None) => (
            StatusCode::NOT_FOUND,
            Json(json!({
                "status": "ko",
                "error": "project_not_found",
            })),
        ),
        Err(error) => {
            eprintln!("[Routes.Projects.get_project] Database error: {error}");

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
