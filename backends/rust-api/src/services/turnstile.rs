//! Cloudflare Turnstile: checks that the token sent with a form was issued to a
//! real visitor of this site. The browser posts straight to this API, so the check
//! has to happen here.

use std::{sync::OnceLock, time::Duration};

use reqwest::Client;
use serde::Deserialize;
use serde_json::json;
use thiserror::Error;

const VERIFY_URL: &str = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const VERIFY_TIMEOUT: Duration = Duration::from_secs(5);
/// Longest token Cloudflare issues.
const MAX_TOKEN_LENGTH: usize = 2048;

#[derive(Debug, Error, PartialEq)]
pub enum TurnstileError {
    /// The visitor's token is missing, forged, expired or already used.
    #[error("token rejected: {0}")]
    Rejected(String),
    /// The check could not be made: network, Cloudflare or our own secret.
    #[error("verification unavailable: {0}")]
    Unavailable(String),
}

#[derive(Debug, Deserialize)]
struct VerifyResponse {
    success: bool,
    #[serde(default, rename = "error-codes")]
    error_codes: Vec<String>,
}

/// Without a secret (local development) the check is off and every token passes.
pub async fn verify(secret: &str, token: &str) -> Result<(), TurnstileError> {
    if secret.is_empty() {
        return Ok(());
    }
    if token.is_empty() || token.len() > MAX_TOKEN_LENGTH {
        return Err(TurnstileError::Rejected(format!(
            "invalid token length ({})",
            token.len()
        )));
    }

    let response = http_client()
        .post(VERIFY_URL)
        .json(&json!({ "secret": secret, "response": token }))
        .send()
        .await
        .map_err(|error| TurnstileError::Unavailable(error.to_string()))?;

    // A wrong secret comes back as a 400 with the same JSON body.
    let status = response.status();
    let body = response
        .json::<VerifyResponse>()
        .await
        .map_err(|error| TurnstileError::Unavailable(format!("{status}: {error}")))?;

    outcome(body)
}

fn outcome(response: VerifyResponse) -> Result<(), TurnstileError> {
    if response.success {
        return Ok(());
    }

    let codes = response.error_codes.join(", ");
    let ours = response.error_codes.iter().any(|code| {
        matches!(
            code.as_str(),
            "missing-input-secret" | "invalid-input-secret" | "internal-error"
        )
    });

    Err(if ours {
        TurnstileError::Unavailable(codes)
    } else {
        TurnstileError::Rejected(codes)
    })
}

/// One client for the whole process: it keeps the TLS roots and connections.
fn http_client() -> &'static Client {
    static CLIENT: OnceLock<Client> = OnceLock::new();

    CLIENT.get_or_init(|| {
        Client::builder()
            .timeout(VERIFY_TIMEOUT)
            .build()
            .expect("[Services.Turnstile] TLS backend is available")
    })
}

#[cfg(test)]
mod tests {
    use super::{MAX_TOKEN_LENGTH, TurnstileError, VerifyResponse, outcome, verify};

    fn response(json: &str) -> VerifyResponse {
        serde_json::from_str(json).unwrap()
    }

    #[tokio::test]
    async fn is_off_without_a_secret() {
        assert_eq!(verify("", "").await, Ok(()));
    }

    #[tokio::test]
    async fn rejects_missing_and_oversized_tokens_without_asking_cloudflare() {
        for token in ["".to_string(), "x".repeat(MAX_TOKEN_LENGTH + 1)] {
            assert!(matches!(
                verify("secret", &token).await,
                Err(TurnstileError::Rejected(_))
            ));
        }
    }

    #[test]
    fn accepts_a_successful_response() {
        let body = r#"{"success":true,"error-codes":[],"hostname":"impablo.dev"}"#;
        assert_eq!(outcome(response(body)), Ok(()));
    }

    #[test]
    fn tells_a_bad_token_from_a_bad_configuration() {
        assert_eq!(
            outcome(response(
                r#"{"success":false,"error-codes":["timeout-or-duplicate"]}"#
            )),
            Err(TurnstileError::Rejected("timeout-or-duplicate".into()))
        );
        assert_eq!(
            outcome(response(
                r#"{"success":false,"error-codes":["invalid-input-secret"],"messages":[]}"#
            )),
            Err(TurnstileError::Unavailable("invalid-input-secret".into()))
        );
        // No codes at all is still a refusal.
        assert!(matches!(
            outcome(response(r#"{"success":false}"#)),
            Err(TurnstileError::Rejected(_))
        ));
    }
}
