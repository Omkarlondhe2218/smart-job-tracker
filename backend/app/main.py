from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database import base

from app.routes.auth import router as auth_router
from app.routes.jobs import router as jobs_router
from app.routes.applications import router as applications_router
from app.routes.dashboard import router as dashboard_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Smart Job Tracker API",
    description="Backend API for Smart Job Application & Career Tracker",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(jobs_router)
app.include_router(applications_router)
app.include_router(dashboard_router)


@app.get("/")
def root():
    return {
        "message": "Smart Job Tracker API is running"
    }


@app.get("/health")
def health_check(
    db: Session = Depends(get_db)
):
    db.execute(text("SELECT 1"))

    return {
        "status": "healthy",
        "database": "connected"
    }