use crate::core::{DBClient, defs::errors::DbConnectionError};
use crate::services::repositories::modules::Repo;

pub async fn list_repositories(db: &DBClient) -> Result<Vec<Repo>, DbConnectionError> {
    let conn = db.get_db_connection().await?;
    

    let raw = conn
        .query(
            "SELECT * FROM portfolio.visible_repositories",
            &[]
            )
        .await?;

    let repos: Vec<Repo> = raw
        .into_iter()
        .map(|r| Repo {
            id: r.get("id"),
            github_id: r.get("github_id"),

            owner: r.get("owner"),
            full_name: r.get("full_name"),

            display_name: r.get("display_name"),
            description: r.get("description"),
            visibility: r.get("visibility"),
            primary_language: r.get("primary_language"),
            repository_url: r.get("repository_url"),

            is_fork: r.get("is_fork"),
            is_archived: r.get("is_archived"),

            github_created_at: r.get("github_created_at"),
            github_updated_at: r.get("github_updated_at"),
            github_pushed_at: r.get("github_pushed_at"),
            synced_at: r.get("synced_at")
        })
        .collect();
        

    return Ok(repos)
}

pub async fn get_repository(db: &DBClient, name: String) -> Result<Option<Repo>, DbConnectionError> {
    let conn = db.get_db_connection().await?;

    let Some(r) = conn
        .query_opt(
            "SELECT * FROM portfolio.visible_repositories WHERE name = $1",
            &[&name],
        )
        .await?
    else {
        return Ok(None)
    };

    let repo: Repo = Repo {
        id: r.get("id"),
        github_id: r.get("github_id"),

        owner: r.get("owner"),
        full_name: r.get("full_name"),

        display_name: r.get("display_name"),
        description: r.get("description"),
        visibility: r.get("visibility"),
        primary_language: r.get("primary_language"),
        repository_url: r.get("repository_url"),

        is_fork: r.get("is_fork"),
        is_archived: r.get("is_archived"),

        github_created_at: r.get("github_created_at"),
        github_updated_at: r.get("github_updated_at"),
        github_pushed_at: r.get("github_pushed_at"),
        synced_at: r.get("synced_at")
    };

    return Ok(Some(repo))    
}