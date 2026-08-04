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


echo "Schema initialized. Checking for private data files."
found_data=false

for file in /opt/postgres/data/*.sql; do
    [ -e "$file" ] || continue

    found_data=true

    echo "Importing $(basename "$file")."

    psql \
        --set=ON_ERROR_STOP=1 \
        --username="$POSTGRES_USER" \
        --dbname="$POSTGRES_DB" \
        --file="$file"
done

if [ "$found_data" = false ]; then
    echo "No private data files found. Skipping data import."
fi

echo "PostgreSQL initialization completed."