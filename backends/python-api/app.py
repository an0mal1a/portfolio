from crons.lifespan import lifespan
from routes import api_router

# FastAPI imports
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

app = FastAPI(title="portfolio-python-api", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://impablo.dev",

        # Local development
        "http://localhost:3000",
        "http://localhost:4001",
    ]
)

# Router construct
app.include_router(api_router)
