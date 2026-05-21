from fastapi import APIRouter
from sqlmodel import select
from app.api.deps import SessionDep

from app.models import Datatype, Age, Gender, Scenario, Source, Region, Report

router = APIRouter(tags=["lookups"])


@router.get("/datatypes")
def get_datatypes(session: SessionDep) -> list[Datatype]:
    """
    Returns all datatypes as list of JSON objects of form {"id": 1, "datatype_description: "population"}
    """
    return list(session.exec(select(Datatype)).all())


@router.get("/ages")
def get_ages(session: SessionDep) -> list[Age]:
    """
    Returns all ages as list of JSON objects of form {"id": 1, "age_group: "0-5"}
    """
    return list(session.exec(select(Age)).all())


@router.get("/genders")
def get_genders(session: SessionDep) -> list[Gender]:
    """
    Returns all genders as list of JSON objects of form {"id": 1, "gender: "Both"}
    """
    return list(session.exec(select(Gender)).all())


@router.get("/scenarios")
def get_scenarios(session: SessionDep) -> list[Scenario]:
    """
    Returns all scenarios as list of JSON objects of form {"id": 1, "scenario": "Estimate"}
    """
    return list(session.exec(select(Scenario)).all())


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

@router.get("/reports")
def get_reports(session: SessionDep) -> list[Report]:
    """
    Returns all reports as list of JSON objects of form {"id": 1, "source_id": 1, "year_published": 2022, "title": "UN World Population Projections 2022"}
    """
    return list(session.exec(select(Report)).all())
