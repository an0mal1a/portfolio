FROM rust:1.96-trixie AS base
WORKDIR /code/rust-api


# Local development: the source is mounted and compiled when the container starts.
FROM base AS dev

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY . .
CMD ["cargo", "run", "--release", "--", "--host", "0.0.0.0", "--port", "8000"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=25s --retries=5 \
    CMD curl --fail --silent --show-error http://127.0.0.1:8000/health/ready || exit 1


# Production: compiled here, while the previous container keeps serving.
FROM base AS build

# The dependencies get their own layer, so a change in src/ does not recompile them.
COPY Cargo.toml Cargo.lock ./
RUN mkdir src \
    && echo 'fn main() {}' > src/main.rs \
    && cargo build --release --locked \
    && rm -r src

COPY src ./src
# Cargo compares modification times: without this it could keep the empty main above.
RUN touch src/main.rs && cargo build --release --locked


FROM debian:trixie-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl libssl3t64 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /code/rust-api/target/release/rust-api /usr/local/bin/rust-api
CMD ["rust-api"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=25s --retries=5 \
    CMD curl --fail --silent --show-error http://127.0.0.1:8000/health/ready || exit 1
