from fastapi import APIRouter
from app.api.v1.endpoints import jobs, candidates, auth, graph

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(candidates.router, prefix="/candidates", tags=["candidates"])
api_router.include_router(graph.router, prefix="/graph", tags=["graph"])
