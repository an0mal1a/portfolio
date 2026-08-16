import os

TIMEZONE = os.getenv("TIMEZONE", "Europe/Madrid")

# Personal token
TOKEN = os.getenv("JOB_TOKEN")
PUBLIC_JOB_HASH_SECRET = os.getenv("PUBLIC_JOB_HASH_SECRET")

# GitHub
GH_TOKEN = os.getenv("GH_TOKEN")
GH_USERNAME = os.getenv("GH_USERNAME")

# PostgreSQL 
POSTGRES_DB = os.getenv("POSTGRES_DB")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", 5432)
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
SYNC_WRITER_USER = os.getenv("SYNC_WRITER_USER")
SYNC_WRITER_PASSWORD = os.getenv("SYNC_WRITER_PASSWORD")
