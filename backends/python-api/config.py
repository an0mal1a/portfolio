import os

TIMEZONE = os.getenv("TIMEZONE", "Europe/Madrid")

# GitHub
GH_TOKEN = os.getenv("GH_TOKEN")
GH_USERNAME = os.getenv("GH_USERNAME")

# PostgreSQL 
POSTGRES_DB = os.getenv("POSTGRES_DB")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", 5432)
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
SYNC_WRITER_USER = os.getenv("SYNC_WRITER_USER")
SYNC_WRITER_PASSWORD = os.getenv("SYNC_WRITER_PASSWORD")
