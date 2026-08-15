pub mod repositories;
pub mod me;

use utoipa::ToSchema;
use utoipa_axum::{router::OpenApiRouter, routes};

use crate::app_state::AppState;

pub fn router() -> OpenApiRouter<AppState> {
    OpenApiRouter::<AppState>::new()
        .routes(routes!(crate::routes::github::me::me))
        .nest("/repositories", repositories::router())
}

#[derive(ToSchema)]
enum ContribLevel {
    None,
    FirstQuartile,
    SecondQuartile,
    ThirdQuartile,
    FourthQuartile
}

#[derive(ToSchema)]
struct GHLink {
    provider: String,
    url: String
}

#[derive(ToSchema)]
struct GHContributions {
    date: String,
    commits: i32,
    contrib_level: ContribLevel
}

#[derive(ToSchema)]
struct GHProfile {
    id: i32,
    name: String,
    account_id: Option<i32>,
    username: String,
    blog: Option<String>,
    bio: Option<String>,
    avatar: Option<String>,
    followers: Option<i32>,
    following: Option<i32>,
    links: Option<Vec<GHLink>>,
    desciption: Option<String>,
    contributions: Option<Vec<GHContributions>>,
}

#[derive(ToSchema)]
#[allow(dead_code)]
struct GHProfileResponse {
    status: String,
    profile: GHProfile,
}

