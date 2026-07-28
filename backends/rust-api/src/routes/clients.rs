use serde_json::{
    Value,
    json
};

use axum::{
    Json, 
    Router, 
    routing::get,
    extract::State, 
    http::StatusCode
};

use crate::{
    app_state::AppState,
    services::repos::read::clients
};

pub fn router() -> Router<AppState> {
    Router::<AppState>::new()
        .route("/", get(list_clients)) 
}

pub async fn list_clients(State(state): State<AppState>) -> (StatusCode, Json<Value>) {
    match clients::list_clients(&state.reader_db).await {
        Ok(c) => (
            StatusCode::OK,
            Json(json!({
                "status": "ok",
                "clients": c
            }))
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
