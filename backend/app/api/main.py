from fastapi import APIRouter

from app.demographics.routes import router as demographics_router
from app.shared.routes import router as shared_router
from app.api.routes.utils import router as utils_router

api_router = APIRouter()
api_router.include_router(shared_router)
api_router.include_router(demographics_router, prefix="/demographics")
api_router.include_router(utils_router)
