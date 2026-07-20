# Cronjobs
from crons import setup_scheduler, scheduler

# FastAPI imports
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

# Other imports
from contextlib import asynccontextmanager

app = FastAPI(title="portfolio-python-api")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://impablo.dev",

        # Local development
        "http://localhost:3000",
    ]
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # This function start the scheduler service
    setup_scheduler()


@app.get("/health")
def health():
    return {
        "status": "ok",
        "message": "Server is running correctly (python)!"
    }
