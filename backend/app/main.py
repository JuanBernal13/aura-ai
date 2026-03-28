from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.init_db import init_db
from app.api.v1.router.api import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Intelligent Candidate-Job Matching Platform",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    init_db()


app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def read_root():
    return {"message": "Welcome to Aura AI API"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
