from fastapi import APIRouter
from sqlmodel import select
from app.api.deps import SessionDep
from pydantic import BaseModel

from app.demographics.models import (
    Datapoint,
    Context,
    Scenario,
    Report,
    Datatype,
    Age,
    Gender
)

from app.shared.models import Region

router = APIRouter(tags=["demographics"])


class DatapointResponse(BaseModel):
    year_analyzed: int
    value: float
    scenario: str
    region_name: str
    report_title: str


@router.get("/datapoints")
def get_datapoints(
    session: SessionDep,
    datatype_id: int | None = None,
    age_id: int | None = None,
    gender_id: int | None = None,
    region_id: int | None = None,
    report_id: int | None = None,
    scenario_id: int | None = None,
    limit: int = 1000,
) -> list[DatapointResponse]:
    """Returns all datapoints as list of JSON objects of form
    {
        "id": 1,
        "input_at": "2026-05-17T15:44:25.918Z",
        "report_id": 1,
        "context_id": 2,
        "scenario_id": 3,
        "year_analyzed": 1986,
        "value": 353605
    }
    """
    query = (
        select(Datapoint, Context, Scenario, Region, Report) # type: ignore
        .select_from(Datapoint)  
        .join(Context)
        .join(Scenario, Datapoint.scenario_id == Scenario.id)
        .join(Region, Context.region_id == Region.id)
        .join(Report, Datapoint.report_id == Report.id)
        .limit(limit)
    )

    # filter for datatype, age, gender, region
    if datatype_id is not None:
        query = query.where(Context.datatype_id == datatype_id)
    if age_id is not None:
        query = query.where(Context.age_id == age_id)
    if gender_id is not None:
        query = query.where(Context.gender_id == gender_id)
    if region_id is not None:
        query = query.where(Context.region_id == region_id)
    if report_id is not None:
        query = query.where(Datapoint.report_id == report_id)
    if scenario_id is not None:
        query = query.where(Datapoint.scenario_id == scenario_id)

    results = session.exec(query).all()
    return [
        DatapointResponse(
            year_analyzed=dp.year_analyzed,
            value=dp.value,
            scenario=scenario.scenario_description,
            region_name=region.region_name,
            report_title=report.title,
        )
        for dp, ctx, scenario, region, report in results
    ]


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

@router.get("/reports")
def get_reports(session: SessionDep) -> list[Report]:
    """
    Returns all reports as list of JSON objects of form {"id": 1, "source_id": 1, "year_published": 2022, "title": "UN World Population Projections 2022"}
    """
    return list(session.exec(select(Report)).all())