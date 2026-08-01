FROM rust:1.96
WORKDIR /code/rust-api

COPY . .
CMD ["cargo", "run", "--release", "--", "--host", "0.0.0.0", "--port", "8000"]