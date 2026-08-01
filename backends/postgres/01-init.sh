#!/bin/bash

set -euo pipefail

echo "Starting PSQL Initialization"
psql \
    --set=ON_ERROR_STOP=1 \
    --username "$POSTGRES_USER" \
    --dbname "$POSTGRES_DB" \
    --set=api_reader_password="$API_READER_PASSWORD" \
    --set=sync_writer_password="$SYNC_WRITER_PASSWORD" \
    --file=/opt/postgres/schema.sql


echo "Initialization done, checking for custom data."
for file in /opt/postgres/data/*.sql; do
    [ -e "$file" ] || continue

    psql \
        --username "$POSTGRES_USER" \
        --dbname "$POSTGRES_DB" \
        --set=api_reader_password="$API_READER_PASSWORD" \
        --set=sync_writer_password="$SYNC_WRITER_PASSWORD" \
        --file="$file"
done