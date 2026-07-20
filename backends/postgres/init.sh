#!/bin/bash

set -euo pipefail

psql \
    --username "$POSTGRES_USER" \
    --dbname "$POSTGRES_DB" \
    --set=api_reader_password="$API_READER_PASSWORD" \
    --set=sync_writer_password="$SYNC_WRITER_PASSWORD" \
    --file=/docker-entrypoint-initdb.d/schema.sql