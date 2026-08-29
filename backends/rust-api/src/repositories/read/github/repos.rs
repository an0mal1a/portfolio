use crate::core::{DBClient, defs::errors::DbConnectionError};
use crate::repositories::modules::{Contributor, Repo};

async fn list_contributors(
    conn: &deadpool_postgres::Client,
    repository_id: i64,
) -> Result<Vec<Contributor>, tokio_postgres::Error> {
    let rows = conn
        .query(
            "SELECT a.github_login, a.avatar_url, a.profile_url, rc.contributions
             FROM github.repository_contributors rc
             JOIN github.accounts a ON a.id = rc.account_id
             WHERE rc.repository_id = $1
             ORDER BY rc.contributions DESC, a.github_login",
            &[&repository_id],
        )
        .await?;

    Ok(rows
        .into_iter()
        .map(|row| Contributor {
            github_login: row.get("github_login"),
            avatar_url: row.get("avatar_url"),
            profile_url: row.get("profile_url"),
            contributions: row.get("contributions"),
        })
        .collect())
}

pub async fn list_repositories(db: &DBClient) -> Result<Vec<Repo>, DbConnectionError> {
    let conn = db.get_db_connection().await?;

    let raw = conn
        .query(
            "SELECT * FROM portfolio.visible_repositories ORDER BY github_pushed_at DESC",
            &[],
        )
        .await?;

    let mut repos: Vec<Repo> = Vec::with_capacity(raw.len());
    for r in raw {
        let id = r.get("id");
        let contributors = list_contributors(&conn, id).await?;
        repos.push(Repo {
            id,
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

            forks_count: r.get("forks_count"),
            open_issues_count: r.get("open_issues_count"),
            stars_count: r.get("stars_count"),

            github_created_at: r.get("github_created_at"),
            github_updated_at: r.get("github_updated_at"),
            github_pushed_at: r.get("github_pushed_at"),
            synced_at: r.get("synced_at"),

            contributors,
        });
    }

    return Ok(repos);
}

pub async fn get_repository(
    db: &DBClient,
    name: String,
) -> Result<Option<Repo>, DbConnectionError> {
    let conn = db.get_db_connection().await?;

    let Some(r) = conn
        .query_opt(
            "SELECT * FROM portfolio.visible_repositories WHERE name = $1",
            &[&name],
        )
        .await?
    else {
        return Ok(None);
    };

    let id = r.get("id");
    let contributors = list_contributors(&conn, id).await?;
    let repo: Repo = Repo {
        id,
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

        forks_count: r.get("forks_count"),
        open_issues_count: r.get("open_issues_count"),
        stars_count: r.get("stars_count"),

        github_created_at: r.get("github_created_at"),
        github_updated_at: r.get("github_updated_at"),
        github_pushed_at: r.get("github_pushed_at"),
        synced_at: r.get("synced_at"),

        contributors,
    };

    return Ok(Some(repo));
}
