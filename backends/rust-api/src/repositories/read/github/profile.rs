use crate::repositories::modules::{GHContributions, GHLink, GHProfile};
use crate::core::{DBClient, defs::errors::DbConnectionError};

// Other
use tokio_postgres::types::Json;

pub async fn get_profile(db: &DBClient) -> Result<Option<GHProfile>, DbConnectionError> {
    let conn = db.get_db_connection().await?;

    let Some(r) = conn
        .query_opt(
            "SELECT * FROM github.profile",
            &[],
        )
        .await?
    else {
        return Ok(None);
    };

    let profile: GHProfile = GHProfile {
        id: r.get("id"),
        account_id: r.get("account_id"),
        github_id: r.get("github_id"),

        name: r.get("name"),
        username: r.get("username"),
        blog: r.get("blog"),
        bio: r.get("bio"),
        avatar: r.get("avatar"),
        description: r.get("description"),
        
        followers: r.get("followers"),
        following: r.get("following"),

        links: r
            .get::<_, Option<Json<Vec<GHLink>>>>("links")
            .map(|json| json.0),

        contributions: r
            .get::<_, Option<Json<Vec<GHContributions>>>>("contributions")
            .map(|json| json.0),
    };

    return Ok(Some(profile));
}
