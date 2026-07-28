use crate::core::DBClient;

#[derive(Clone)]
pub struct AppState {
    pub reader_db: DBClient,
    pub writer_db: DBClient,
}
