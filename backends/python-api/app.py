from crons.lifespan import lifespan

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

@app.get("/health")
def health():
    return {
        "status": "ok",
        "message": "Server is running correctly (python)!"
    }
