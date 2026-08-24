FROM rust:1.96
WORKDIR /code/rust-api

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY . .
CMD ["cargo", "run", "--release", "--", "--host", "0.0.0.0", "--port", "8000"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=25s --retries=5 \
    CMD curl --fail --silent --show-error http://127.0.0.1:8000/health/ready || exit 1
