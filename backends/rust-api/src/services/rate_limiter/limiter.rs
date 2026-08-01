// src/middleware/rate_limit.rs
// Rate limiting middleware for Axum

use axum::{
    body::Body,
    extract::{ConnectInfo, State},
    http::{HeaderName, HeaderValue, Request, StatusCode, header::RETRY_AFTER},
    middleware::Next,
    response::{IntoResponse, Response},
};
use governor::{
    Quota, RateLimiter,
    clock::{Clock, DefaultClock},
    state::keyed::DefaultKeyedStateStore,
};
use std::net::{IpAddr, SocketAddr};
use std::num::NonZeroU32;
use std::sync::Arc;

/// Rate limiter state
pub struct RateLimitState {
    /// Per-IP limiter for one route group.
    ip_limiter: RateLimiter<IpAddr, DefaultKeyedStateStore<IpAddr>, DefaultClock>,
}

impl RateLimitState {
    pub fn per_minute(requests: u32) -> Self {
        Self {
            ip_limiter: RateLimiter::keyed(Quota::per_minute(
                NonZeroU32::new(requests).expect("Rate limit must be greater than zero"),
            )),
        }
    }
}

/// Rate limiting middleware
pub async fn rate_limit_middleware(
    State(state): State<Arc<RateLimitState>>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    request: Request<Body>,
    next: Next,
) -> Response {
    let ip = addr.ip();

    // Check IP rate limit
    match state.ip_limiter.check_key(&ip) {
        Ok(_) => {
            // Request allowed
            next.run(request).await
        }
        Err(not_until) => {
            let wait_time =
                not_until.wait_time_from(governor::clock::DefaultClock::default().now());
            let retry_after = if wait_time.subsec_nanos() == 0 {
                wait_time.as_secs()
            } else {
                wait_time.as_secs().saturating_add(1)
            }
            .max(1);

            eprintln!(
                "[MIDDLEWARE.LIMITER] Rate limit exceeded. ip=({}) retry_after=({})",
                ip, retry_after
            );

            let mut response = (
                StatusCode::TOO_MANY_REQUESTS,
                axum::Json(serde_json::json!({
                    "status": "ko",
                    "error": "rate_limited",
                    "retry_after": retry_after,
                })),
            )
                .into_response();

            let retry_after_value = HeaderValue::from_str(&retry_after.to_string())
                .expect("retry-after value is valid");
            response
                .headers_mut()
                .insert(RETRY_AFTER, retry_after_value.clone());
            response.headers_mut().insert(
                HeaderName::from_static("ratelimit-reset"),
                retry_after_value,
            );

            response
        }
    }
}
