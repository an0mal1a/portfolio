FROM postgres:18

COPY 01-init.sh /docker-entrypoint-initdb.d/01-init.sh
COPY schema.sql /opt/postgres/schema.sql
# COPY hardcoded_data /opt/postgres/data

RUN mkdir -p /opt/postgres/data \
    && chmod +x /docker-entrypoint-initdb.d/01-init.sh