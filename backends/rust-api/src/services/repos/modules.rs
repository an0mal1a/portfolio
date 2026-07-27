use chrono::{DateTime, NaiveDate, Utc};
use serde::Serialize;

#[derive(Serialize)]
pub struct Project {
    pub id: i64,
    pub github_repository_id: Option<i64>,
    pub github_repository_github_id: Option<i64>,
    pub client_id: Option<i64>,

    pub name: String,
    pub slug: String,
    pub tagline: Option<String>,
    pub description: String,

    pub project_type: String,
    pub status: String,
    pub repository_url: Option<String>,
    pub live_url: Option<String>,

    pub is_featured: bool,
    pub is_public: bool,

    pub started_at: Option<NaiveDate>,
    pub completed_at: Option<NaiveDate>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}