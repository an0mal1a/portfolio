use crate::core::{DBClient, defs::errors::DbConnectionError};
use crate::repositories::modules::Project;

pub async fn list_projects(db: &DBClient) -> Result<Vec<Project>, DbConnectionError> {
    let conn = db.get_db_connection().await?;

    // Exeute sql
    let projects = conn
        .query(
            "SELECT * FROM portfolio.projects
             WHERE is_public = TRUE
             ORDER BY is_featured DESC, (image IS NOT NULL) DESC, started_at DESC NULLS LAST, created_at DESC",
            &[],
        )
        .await?;

    let projects: Vec<Project> = projects
        .into_iter()
        .map(|r| Project {
            id: r.get("id"),
            github_repository_id: r.get("github_repository_id"),
            github_repository_github_id: r.get("github_repository_github_id"),
            client_id: r.get("client_id"),

            name: r.get("name"),
            slug: r.get("slug"),
            tagline: r.get("tagline"),
            description: r.get("description"),
            content_html: r.get("content_html"),

            project_type: r.get("project_type"),
            status: r.get("status"),
            image: r.get("image"),
            repository_url: r.get("repository_url"),
            live_url: r.get("live_url"),

            is_featured: r.get("is_featured"),
            is_public: r.get("is_public"),

            started_at: r.get("started_at"),
            completed_at: r.get("completed_at"),
            created_at: r.get("created_at"),
            updated_at: r.get("updated_at"),
        })
        .collect();

    return Ok(projects);
}

pub async fn get_project(
    db: &DBClient,
    slug: String,
) -> Result<Option<Project>, DbConnectionError> {
    let conn = db.get_db_connection().await?;

    let Some(r) = conn
        .query_opt(
            "SELECT * FROM portfolio.projects WHERE slug = $1 AND is_public = TRUE",
            &[&slug],
        )
        .await?
    else {
        return Ok(None);
    };

    let project: Project = Project {
        id: r.get("id"),
        github_repository_id: r.get("github_repository_id"),
        github_repository_github_id: r.get("github_repository_github_id"),
        client_id: r.get("client_id"),

        name: r.get("name"),
        slug: r.get("slug"),
        tagline: r.get("tagline"),
        description: r.get("description"),
        content_html: r.get("content_html"),

        project_type: r.get("project_type"),
        status: r.get("status"),
        image: r.get("image"),
        repository_url: r.get("repository_url"),
        live_url: r.get("live_url"),

        is_featured: r.get("is_featured"),
        is_public: r.get("is_public"),

        started_at: r.get("started_at"),
        completed_at: r.get("completed_at"),
        created_at: r.get("created_at"),
        updated_at: r.get("updated_at"),
    };

    return Ok(Some(project));
}
