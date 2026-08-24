use crate::core::DBClient;
use std::{
    sync::{
        Arc,
        atomic::{AtomicBool, Ordering},
    },
    time::Instant,
};

#[derive(Clone)]
pub struct AppState {
    pub reader_db: DBClient,
    pub writer_db: DBClient,
    pub started_at: Instant,
    accepting_requests: Arc<AtomicBool>,
}

impl AppState {
    pub fn new(reader_db: DBClient, writer_db: DBClient) -> Self {
        Self {
            reader_db,
            writer_db,
            started_at: Instant::now(),
            accepting_requests: Arc::new(AtomicBool::new(true)),
        }
    }

    pub fn is_ready(&self) -> bool {
        self.accepting_requests.load(Ordering::Acquire)
    }

    pub fn begin_shutdown(&self) {
        self.accepting_requests.store(false, Ordering::Release);
    }
}
