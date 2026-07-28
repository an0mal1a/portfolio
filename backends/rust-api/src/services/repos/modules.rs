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


#[derive(Serialize)]
pub struct Repo {
    pub id: i64,
    pub github_id: Option<i64>,

    pub owner: String,
    pub full_name: Option<String>,

    pub display_name: String,
    pub description: Option<String>,
    pub visibility: String,
    pub primary_language: Option<String>,

    pub is_fork: bool,
    pub is_archived: bool,
    pub repository_url: Option<String>,

    pub github_created_at: Option<DateTime<Utc>>,
    pub github_updated_at: Option<DateTime<Utc>>,
    pub github_pushed_at: Option<DateTime<Utc>>,
    pub synced_at: Option<DateTime<Utc>>,
}