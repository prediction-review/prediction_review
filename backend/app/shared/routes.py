from fastapi import APIRouter
from sqlmodel import select
from app.api.deps import SessionDep

from app.shared.models import Source, Region

router = APIRouter(tags=["shared"])


@router.get("/sources")
def get_sources(session: SessionDep) -> list[Source]:
    """
    Returns all sources as list of JSON objects of form {"id": 1, "name": "United Nations"}
    """
    return list(session.exec(select(Source)).all())


@router.get("/regions")
def get_regions(session: SessionDep) -> list[Region]:
    """
    Returns all regions as list of JSON objects of form {"id": 258, "region_name": "Canada", "region_short": null, "parent_id": null, "iso2": "CA", "iso3": "CAN", "iso_num": 124,}
    """
    return list(session.exec(select(Region)).all())


