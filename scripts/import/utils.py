from app.models import (
    Datatype,
    Age,
    Gender,
    Region,
    Context,
    Datapoint,
    Scenario,
    Report,
)
from typing import Protocol, cast
import pandas as pd
import re

from sqlmodel import Session, SQLModel, select, col
from sqlalchemy.orm import InstrumentedAttribute


class HasId(Protocol):
    id: int


def get_UN_headers(dataframe: pd.DataFrame, header_row: int = 15, series_row: int = 16):
    """
    dataframe should be the specific sheet you want to look at, parsed as a dataframe object.  It must be parsed to at least the rows containing the headers
    """

    headers = dataframe.iloc[header_row].tolist()
    series = dataframe.iloc[series_row].tolist()

    header_list = []
    for head, ser in zip(headers, series):
        if pd.notna(ser):
            header_list.append(str(int(ser)) if isinstance(ser, float) else str(ser))
        else:
            header_list.append(str(head))
    return header_list


def read_un_sheet(file: str, sheetName: str) -> pd.DataFrame:
    """
    takes in a file and a worksheet and produces a labeled dataframe
    """
    df = pd.read_excel(file, sheet_name=sheetName, header=None, nrows=17)
    headers = get_UN_headers(df)
    data = pd.read_excel(file, sheet_name=sheetName, header=None, skiprows=17)
    data.columns = headers
    return data


def get_id(
    session: Session,
    table: type[HasId],
    column,
    key: str | int,
) -> int:
    return cast(HasId, session.exec(select(table).where(column == key)).first()).id
    # if result is None:
    #     raise ValueError(f"value {key} in table {table.__tablename__} not found")
    # return result.id


def get_datatype_id(session: Session, key: str) -> int:
    return get_id(session, Datatype, Datatype.datatype_description, key)


def get_age_id(session: Session, key: str) -> int:
    return get_id(session, Age, Age.age_group, key)


def get_gender_id(session: Session, key: str) -> int:
    return get_id(session, Gender, Gender.gender_group, key)


def get_region_id(session: Session, key: int) -> int:
    """
    input: active session and 3 digit ISO number
    output: region.id for that ISO number
    """
    return get_id(session, Region, Region.iso_num, key)


def get_context_id(
    session: Session, datatype_id: int, age_id: int, gender_id: int, region_id: int
) -> int:
    context = session.exec(
        select(Context).where(
            Context.datatype_id == datatype_id,
            Context.age_id == age_id,
            Context.gender_id == gender_id,
            Context.region_id == region_id,
        )
    ).first()
    if context is None: # make a new context
        context = Context(
                    datatype_id=datatype_id,
                    age_id=age_id,
                    gender_id=gender_id,
                    region_id=region_id,
                )
        session.add(context)
        session.flush()
        session.refresh(context)
    if context.id is None:
        raise ValueError(f"context {(datatype_id, age_id, gender_id, region_id)} has no attribute 'id'")
    return context.id


def get_scenario_id(session: Session, key: str) -> int:
    scenario = session.exec(
        select(Scenario).where(col(Scenario.scenario_description).ilike(f"%{key}%"))
    ).first()
    if scenario is None:
        raise ValueError(f"context not found for {f"scenario '{key}' not found"}")
    if scenario.id is None:
        raise ValueError(f"scenario {key} has no attribute 'id'")
    return scenario.id

def get_report_id(session: Session, key: str) -> int:
    """
    input: the name of the report
    output: the corresponding id in the database
    """
    report = session.exec(
        select(Report).where(Report.title == key)
    ).first()
    if report is None:
        raise ValueError(f"report with title '{key}' not found")
    if report.id is None:
        raise ValueError(f"{key} report is 'None'")
    return report.id