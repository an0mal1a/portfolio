use deadpool_postgres::Pool;

#[derive(Clone)]
pub struct DBClient {
    pub pool: Pool,
}

pub enum Permission {
    WRITER,
    READER,
}
