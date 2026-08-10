use std::time::{Duration, Instant};

use axum::Json;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use tokio::{net::TcpStream, time::timeout};
use utoipa::ToSchema;
use utoipa_axum::{router::OpenApiRouter, routes};

use crate::{
    app_state::AppState, config::CONFIG, core::DBClient, services::web_requester::WebRequester,
};

#[derive(Debug, Serialize, ToSchema, Clone)]
#[serde(rename_all = "snake_case")]
pub struct ServiceStatus {
    pub status: String,
    pub latency_ms: Option<u64>,
    pub detail: Option<String>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct DatabaseStatus {
    pub status: String,
    pub reader_pool: ServiceStatus,
    pub writer_pool: ServiceStatus,
    pub latency_ms: Option<u64>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct GithubStatus {
    pub status: String,
    pub last_sync: Option<DateTime<Utc>>,
    pub repositories: i64,
    pub languages: i64,
    pub duration_ms: Option<i32>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct SystemStatus {
    pub status: String,
    pub generated_at: DateTime<Utc>,
    pub api_version: String,
    pub requests_served: Option<u64>,
    pub uptime_seconds: u64,
    pub services: Services,
    pub github: GithubStatus,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct Services {
    pub database: DatabaseStatus,
    pub python_worker: ServiceStatus,
    pub smtp: ServiceStatus,
}

pub fn router() -> OpenApiRouter<AppState> {
    OpenApiRouter::<AppState>::new().routes(routes!(system_status))
}

#[utoipa::path(
    get,
    path = "/system/status",
    tag = "System",
    responses((status = 200, description = "Estado operativo agregado", body = SystemStatus))
)]
pub async fn system_status(
    axum::extract::State(state): axum::extract::State<AppState>,
) -> Json<SystemStatus> {
    let cfg = CONFIG.get().expect("Config not initialized");

    let timeout_window = Duration::from_secs(2);
    let reader = state.reader_db.clone();
    let writer = state.writer_db.clone();
    let python_url = cfg.python_api_url.clone();
    let smtp_host = cfg.smtp_host.clone();

    let (database, github, python_worker, smtp) = tokio::join!(
        probe_database(reader, writer, timeout_window),
        probe_github(state.writer_db.clone(), timeout_window),
        probe_python(python_url, timeout_window),
        probe_smtp(smtp_host, timeout_window),
    );

    let required_ok = database.status == "healthy" && python_worker.status == "healthy";
    Json(SystemStatus {
        status: if required_ok {
            "operational"
        } else {
            "degraded"
        }
        .to_string(),
        generated_at: Utc::now(),
        api_version: env!("CARGO_PKG_VERSION").to_string(),
        requests_served: None,
        uptime_seconds: state.started_at.elapsed().as_secs(),
        services: Services {
            database,
            python_worker,
            smtp,
        },
        github,
    })
}

async fn probe_database(reader: DBClient, writer: DBClient, window: Duration) -> DatabaseStatus {
    let (reader_probe, writer_probe) =
        tokio::join!(probe_pool(reader, window), probe_pool(writer, window));
    let latency_ms = [reader_probe.latency_ms, writer_probe.latency_ms]
        .into_iter()
        .flatten()
        .max();
    DatabaseStatus {
        status: if reader_probe.status == "healthy" && writer_probe.status == "healthy" {
            "healthy"
        } else {
            "degraded"
        }
        .to_string(),
        reader_pool: reader_probe,
        writer_pool: writer_probe,
        latency_ms,
    }
}

async fn probe_pool(db: DBClient, window: Duration) -> ServiceStatus {
    let started = Instant::now();
    let result = timeout(window, async {
        let conn = db.get_db_connection().await.map_err(|e| e.to_string())?;
        conn.query_one("SELECT 1", &[])
            .await
            .map_err(|e| e.to_string())
    })
    .await;
    match result {
        Ok(Ok(_)) => ServiceStatus {
            status: "healthy".to_string(),
            latency_ms: Some(started.elapsed().as_millis() as u64),
            detail: None,
        },
        Ok(Err(error)) => ServiceStatus {
            status: "unhealthy".to_string(),
            latency_ms: None,
            detail: Some(error),
        },
        Err(_) => ServiceStatus {
            status: "timeout".to_string(),
            latency_ms: None,
            detail: Some("database probe exceeded 2s".to_string()),
        },
    }
}

async fn probe_github(db: DBClient, window: Duration) -> GithubStatus {
    let result = timeout(window, async {
        let conn = db.get_db_connection().await.map_err(|e| e.to_string())?;
        let job = conn.query_opt(
            "SELECT completed_at, started_at, status, duration_ms FROM github.sync_jobs ORDER BY started_at DESC LIMIT 1",
            &[],
        ).await.map_err(|e| e.to_string())?;
        let repositories = conn.query_one("SELECT COUNT(*) FROM github.repositories", &[]).await.map_err(|e| e.to_string())?.get::<_, i64>(0);
        let languages = conn.query_one("SELECT COUNT(DISTINCT language) FROM github.repository_languages", &[]).await.map_err(|e| e.to_string())?.get::<_, i64>(0);
        Ok::<_, String>((job, repositories, languages))
    }).await;
    match result {
        Ok(Ok((job, repositories, languages))) => {
            let (last_sync, status, duration_ms) =
                job.map_or((None, "unknown".to_string(), None), |row| {
                    (
                        row.get::<_, Option<DateTime<Utc>>>("completed_at")
                            .or_else(|| row.get("started_at")),
                        row.get("status"),
                        row.get("duration_ms"),
                    )
                });
            GithubStatus {
                status: if status == "completed" {
                    "healthy"
                } else if status == "in_progress" {
                    "running"
                } else {
                    "degraded"
                }
                .to_string(),
                last_sync,
                repositories,
                languages,
                duration_ms,
            }
        }
        Ok(Err(_error)) => GithubStatus {
            status: "unavailable".to_string(),
            last_sync: None,
            repositories: 0,
            languages: 0,
            duration_ms: None,
        },
        Err(_) => GithubStatus {
            status: "timeout".to_string(),
            last_sync: None,
            repositories: 0,
            languages: 0,
            duration_ms: None,
        },
    }
}

/// Lightweight internal contract: `GET /health` must return a fast JSON
/// response with `{ "status": "ok" }` (or `healthy`). Extra fields are
/// intentionally ignored so the worker can evolve without coupling the API.
async fn probe_python(base_url: String, window: Duration) -> ServiceStatus {
    match WebRequester::new(window)
        .get(&format!("{}/health", base_url.trim_end_matches('/')))
        .await
    {
        Ok(response) if response.is_success() => {
            let health = serde_json::from_slice::<PythonHealth>(&response.body);
            if !matches!(health, Ok(PythonHealth { status }) if status == "ok" || status == "healthy")
            {
                return ServiceStatus {
                    status: "unhealthy".to_string(),
                    latency_ms: Some(response.latency_ms),
                    detail: Some("Python respondió sin status ok/healthy".to_string()),
                };
            }
            ServiceStatus {
                status: "healthy".to_string(),
                latency_ms: Some(response.latency_ms),
                detail: None,
            }
        }
        Ok(response) => ServiceStatus {
            status: "unhealthy".to_string(),
            latency_ms: None,
            detail: Some(format!("HTTP {}", response.status_code)),
        },
        Err(error) => ServiceStatus {
            status: if error.is_timeout() {
                "timeout"
            } else {
                "unreachable"
            }
            .to_string(),
            latency_ms: None,
            detail: Some(error.to_string()),
        },
    }
}

#[derive(Debug, Deserialize)]
struct PythonHealth {
    status: String,
}

async fn probe_smtp(host: String, window: Duration) -> ServiceStatus {
    if host.trim().is_empty() {
        return ServiceStatus {
            status: "disabled".to_string(),
            latency_ms: None,
            detail: Some("SMTP_HOST no configurado".to_string()),
        };
    }
    let started = Instant::now();
    let endpoint = if host.contains(':') {
        host
    } else {
        format!("{}:25", host)
    };
    match timeout(window, TcpStream::connect(endpoint)).await {
        Ok(Ok(_)) => ServiceStatus {
            status: "healthy".to_string(),
            latency_ms: Some(started.elapsed().as_millis() as u64),
            detail: None,
        },
        Ok(Err(error)) => ServiceStatus {
            status: "unreachable".to_string(),
            latency_ms: None,
            detail: Some(error.to_string()),
        },
        Err(_) => ServiceStatus {
            status: "timeout".to_string(),
            latency_ms: None,
            detail: Some("SMTP probe exceeded 2s".to_string()),
        },
    }
}
