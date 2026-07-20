from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="portfolio-python-api")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://impablo.dev",

        # Local development
        "http://localhost:3000",
    ]
)

@app.get("/health")
def health():
    return {
        "status": "ok",
        "message": "Server is running correctly (python)!"
    }
