from fastapi import APIRouter

from app.api.routes import utils, lookups, datapoints

api_router = APIRouter()
api_router.include_router(utils.router)
api_router.include_router(lookups.router)
api_router.include_router(datapoints.router)
