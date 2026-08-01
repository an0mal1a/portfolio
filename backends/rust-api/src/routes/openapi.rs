//! Tipos compartidos exclusivamente para describir la API pública en OpenAPI.

use utoipa::ToSchema;

/// Formato de error común devuelto por los endpoints de lectura.
#[derive(ToSchema)]
#[allow(dead_code)]
pub struct ApiErrorResponse {
    pub status: String,
    pub error: String,
}
