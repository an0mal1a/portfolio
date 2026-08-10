use crate::core::DBClient;
use std::time::Instant;

#[derive(Clone)]
pub struct AppState {
    pub reader_db: DBClient,
    pub writer_db: DBClient,
    pub started_at: Instant,
}
