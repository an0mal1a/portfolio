use std::{
    collections::BTreeMap,
    io,
    time::{Duration, Instant},
};

use thiserror::Error;
use tokio::{
    io::{AsyncReadExt, AsyncWriteExt},
    net::{TcpStream, lookup_host},
    time::timeout,
};

#[derive(Debug, Error)]
pub enum WebRequestError {
    #[error("unsupported URL scheme: {0}")]
    UnsupportedScheme(String),
    #[error("invalid URL: {0}")]
    InvalidUrl(String),
    #[error("invalid HTTP response")]
    InvalidResponse,
    #[error("request timed out")]
    Timeout,
    #[error("network error: {0}")]
    Io(#[from] io::Error),
}

impl WebRequestError {
    pub fn is_timeout(&self) -> bool {
        matches!(self, Self::Timeout)
    }
}

#[allow(dead_code)]
#[derive(Debug, Clone)]
pub struct WebResponse {
    pub status_code: u16,
    pub headers: BTreeMap<String, String>,
    pub body: Vec<u8>,
    pub latency_ms: u64,
}

#[allow(dead_code)]
impl WebResponse {
    pub fn is_success(&self) -> bool {
        (200..300).contains(&self.status_code)
    }
    pub fn body_text(&self) -> String {
        String::from_utf8_lossy(&self.body).into_owned()
    }
}

#[derive(Debug, Clone)]
pub struct WebRequester {
    timeout: Duration,
}

impl WebRequester {
    pub fn new(timeout: Duration) -> Self {
        Self { timeout }
    }

    pub async fn get(&self, url: &str) -> Result<WebResponse, WebRequestError> {
        self.request("GET", url, &[]).await
    }

    pub async fn request(
        &self,
        method: &str,
        url: &str,
        headers: &[(String, String)],
    ) -> Result<WebResponse, WebRequestError> {
        let endpoint = HttpEndpoint::parse(url)?;
        let method = method.trim().to_uppercase();
        if method.is_empty() || method.contains(char::is_whitespace) {
            return Err(WebRequestError::InvalidUrl(
                "invalid HTTP method".to_string(),
            ));
        }
        let started = Instant::now();
        let result = timeout(self.timeout, async {
            let mut addresses = lookup_host((endpoint.host.as_str(), endpoint.port)).await?;
            let mut stream = None;
            let mut last_error = None;
            while let Some(address) = addresses.next() {
                // `localhost` can resolve to IPv6 before 127.0.0.1. A service
                // bound only to IPv4 must not consume the complete request timeout.
                match timeout(Duration::from_millis(200), TcpStream::connect(address)).await {
                    Ok(Ok(connected)) => {
                        stream = Some(connected);
                        break;
                    }
                    Ok(Err(error)) => last_error = Some(error),
                    Err(_) => {
                        last_error = Some(io::Error::new(
                            io::ErrorKind::TimedOut,
                            format!("connection to {address} timed out"),
                        ));
                    }
                }
            }
            let mut stream = stream.ok_or_else(|| {
                last_error.unwrap_or_else(|| {
                    io::Error::new(io::ErrorKind::AddrNotAvailable, "no address available")
                })
            })?;
            let mut request = format!(
                "{method} {} HTTP/1.1\r\nHost: {}\r\nConnection: close\r\nAccept: application/json\r\n",
                endpoint.path, endpoint.host
            );
            for (name, value) in headers {
                request.push_str(&format!("{name}: {value}\r\n"));
            }
            request.push_str("\r\n");
            stream.write_all(request.as_bytes()).await?;
            let raw = read_response(&mut stream).await?;
            parse_response(raw)
        }).await;

        match result {
            Ok(response) => response.map(|mut response| {
                response.latency_ms = started.elapsed().as_millis() as u64;
                response
            }),
            Err(_) => Err(WebRequestError::Timeout),
        }
    }
}

async fn read_response(stream: &mut TcpStream) -> Result<Vec<u8>, io::Error> {
    let mut raw = Vec::with_capacity(1024);
    let mut buffer = [0_u8; 1024];

    let header_end = loop {
        let received = stream.read(&mut buffer).await?;
        if received == 0 {
            return Err(io::Error::new(
                io::ErrorKind::UnexpectedEof,
                "connection closed before HTTP headers",
            ));
        }
        raw.extend_from_slice(&buffer[..received]);
        if let Some(position) = raw.windows(4).position(|window| window == b"\r\n\r\n") {
            break position + 4;
        }
    };

    let header = std::str::from_utf8(&raw[..header_end])
        .map_err(|_| io::Error::new(io::ErrorKind::InvalidData, "HTTP headers are not UTF-8"))?;
    let content_length = header.lines().find_map(|line| {
        line.split_once(':').and_then(|(name, value)| {
            name.eq_ignore_ascii_case("content-length")
                .then(|| value.trim().parse::<usize>().ok())
                .flatten()
        })
    });

    if let Some(content_length) = content_length {
        let expected_size = header_end + content_length;
        while raw.len() < expected_size {
            let received = stream.read(&mut buffer).await?;
            if received == 0 {
                return Err(io::Error::new(
                    io::ErrorKind::UnexpectedEof,
                    "connection closed before HTTP body",
                ));
            }
            raw.extend_from_slice(&buffer[..received]);
        }
        raw.truncate(expected_size);
        return Ok(raw);
    }

    stream.read_to_end(&mut raw).await?;
    Ok(raw)
}

#[derive(Debug)]
struct HttpEndpoint {
    host: String,
    port: u16,
    path: String,
}

impl HttpEndpoint {
    fn parse(url: &str) -> Result<Self, WebRequestError> {
        let (scheme, authority_and_path) = url
            .split_once("://")
            .ok_or_else(|| WebRequestError::InvalidUrl(url.to_string()))?;
        if scheme != "http" {
            return Err(WebRequestError::UnsupportedScheme(scheme.to_string()));
        }
        let (authority, path) = authority_and_path
            .split_once('/')
            .unwrap_or((authority_and_path, ""));
        if authority.is_empty() {
            return Err(WebRequestError::InvalidUrl(url.to_string()));
        }
        let (host, port) = authority
            .rsplit_once(':')
            .map(|(host, port)| (host, port.parse().unwrap_or(80)))
            .unwrap_or((authority, 80));
        if host.is_empty() {
            return Err(WebRequestError::InvalidUrl(url.to_string()));
        }
        Ok(Self {
            host: host.to_string(),
            port,
            path: format!("/{}", path),
        })
    }
}

fn parse_response(raw: Vec<u8>) -> Result<WebResponse, WebRequestError> {
    let separator = raw
        .windows(4)
        .position(|window| window == b"\r\n\r\n")
        .ok_or(WebRequestError::InvalidResponse)?;
    let head =
        std::str::from_utf8(&raw[..separator]).map_err(|_| WebRequestError::InvalidResponse)?;
    let mut lines = head.lines();
    let status_code = lines
        .next()
        .and_then(|line| line.split_whitespace().nth(1))
        .and_then(|status| status.parse().ok())
        .ok_or(WebRequestError::InvalidResponse)?;
    let mut headers = BTreeMap::new();
    for line in lines {
        if let Some((name, value)) = line.split_once(':') {
            headers.insert(name.trim().to_ascii_lowercase(), value.trim().to_string());
        }
    }
    Ok(WebResponse {
        status_code,
        headers,
        body: raw[separator + 4..].to_vec(),
        latency_ms: 0,
    })
}

#[cfg(test)]
mod tests {
    use super::WebRequester;
    use std::time::Duration;
    use tokio::{
        io::{AsyncReadExt, AsyncWriteExt},
        net::TcpListener,
        time::sleep,
    };

    #[tokio::test]
    async fn stops_after_content_length_without_waiting_for_socket_close() {
        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let port = listener.local_addr().unwrap().port();
        tokio::spawn(async move {
            let (mut stream, _) = listener.accept().await.unwrap();
            let mut request = [0_u8; 1024];
            stream.read(&mut request).await.unwrap();
            stream
                .write_all(b"HTTP/1.1 200 OK\r\nContent-Length: 15\r\n\r\n{\"status\":\"ok\"}")
                .await
                .unwrap();
            sleep(Duration::from_secs(1)).await;
        });

        let response = WebRequester::new(Duration::from_millis(250))
            .get(&format!("http://127.0.0.1:{port}/health"))
            .await
            .unwrap();

        assert_eq!(response.status_code, 200);
        assert_eq!(response.body_text(), r#"{"status":"ok"}"#);
    }

    #[tokio::test]
    async fn falls_back_to_ipv4_when_localhost_has_an_unavailable_ipv6_address() {
        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let port = listener.local_addr().unwrap().port();
        tokio::spawn(async move {
            let (mut stream, _) = listener.accept().await.unwrap();
            let mut request = [0_u8; 1024];
            stream.read(&mut request).await.unwrap();
            stream
                .write_all(b"HTTP/1.1 200 OK\r\nContent-Length: 15\r\n\r\n{\"status\":\"ok\"}")
                .await
                .unwrap();
        });

        let response = WebRequester::new(Duration::from_secs(1))
            .get(&format!("http://localhost:{port}/health"))
            .await
            .unwrap();

        assert_eq!(response.status_code, 200);
    }
}
