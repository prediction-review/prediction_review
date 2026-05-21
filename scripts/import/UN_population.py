from pathlib import Path
import pandas as pd
import re

from sqlmodel import Session, select
from app.core.db import engine
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

from utils import (
    get_UN_headers,
    read_un_sheet,
    get_report_id,
    get_datatype_id,
    get_age_id,
    get_gender_id,
    get_region_id,
    get_context_id,
    get_scenario_id,
)

# assumes prediction_center/backend as root

# 2000 population
# FILE = "../../WPP2000/WPP2000_EXCEL_FILES/DB02_Stock_Indicators/WPP2000_DB2_F1_TOTAL_POPULATION_BOTH_SEXES.xls"

# 2022 population
FILE = "../../WPP2022/EXCEL_FILES/2_Population/WPP2022_POP_F03_1_POPULATION_SELECT_AGE_GROUPS_BOTH_SEXES.xlsx"


def get_dataframe_from_file(file: str, year: int) -> pd.DataFrame:
    """
    Pulls all relevant data from a given file.  Takes a file path as input and outputs a combined and labelled dataframe of only the relevant data
    """

    # stitching all sheets together

    # pop off notes sheet
    all_sheets = pd.ExcelFile(file).sheet_names
    sheets_to_read = all_sheets[:4]  # only constructs estimates, low, high, medium
    # TODO: other sheets may have different sheets where you don't just want the first 4

    dfs = []
    for sheet in sheets_to_read:
        df = read_un_sheet(file, sheet)
        if year == 2000:
            # rename columns
            df = df.rename(
                columns={
                    "Major area, region, country or area": "region_name",
                    "Country code": "iso_num",
                }
            )

            # parse year vs metadata headers
            year_columns = [col for col in df.columns if str(col).isdigit()]
            metadata_columns = [col for col in df.columns if not str(col).isdigit()]

            # make tall
            df = df.melt(
                id_vars=metadata_columns,  # columns to keep
                value_vars=year_columns,  # columns to pivot
                var_name="year_analyzed",  # new name of header column
                value_name="value",  # new name of value column
            )
        if year == 2022:
            # rename columns
            df = df.rename(
                columns={
                    "Region, subregion, country or area *": "region_name",
                    "Location code": "iso_num",
                    "Year": "year_analyzed",
                    "Total": "value",
                }
            )

            df = df.dropna(subset=["year_analyzed"])

        # cast to new types
        df["year_analyzed"] = df["year_analyzed"].astype(int)
        df["value"] = (df["value"] * 1000).astype(int)

        # attach metadata
        df["datatype"] = "Population"  # TODO: pull from sheet properly
        df["age_group"] = "None"  # TODO: pull from sheet properly
        df["gender"] = "Both"  # TODO: pull from sheet properly
        df["scenario"] = sheet
        # TODO: this data exists in the "variant" col, can pull from that directly (and dont have to deal with the regex nonsense)

        dfs.append(df)

    dfs_combined = pd.concat(dfs, ignore_index=True)

    # delete columns I don't care about
    dfs_combined = dfs_combined.drop(["Index", "Notes"], axis=1)

    # keep only columns I care about
    # 2022 CASE ONLY, TEST WITH 2000
    dfs_combined = dfs_combined[
        [
            "region_name",
            "iso_num",
            "year_analyzed",
            "value",
            "datatype",
            "age_group",
            "gender",
            "scenario",
        ]
    ]

    # check for missing data with
    # missing = full_data.isnull().values.any()
    # print(missing)

    return dfs_combined


def populate_datapoints(df: pd.DataFrame, report_id: int):
    """
    takes as input a dataframe, populates the datapoint table with all data in the dataframe
    """
    with Session(engine) as session:
        # builds key directly from the context object
        for _, row in df.iterrows():
            datatype_id = get_datatype_id(session, row["datatype"])
            age_id = get_age_id(session, row["age"])
            gender_id = get_gender_id(session, row["gender"])
            region_id = get_region_id(session, row["iso_num"])
            context_id = get_context_id(
                session, datatype_id, age_id, gender_id, region_id
            )

            # context object is now in database, context_id holds the relevant id (also accessible with context.id)
            new_datapoint = Datapoint(
                report_id=report_id,  # TODO: Can handle UN reports, can't do anything else
                context_id=context_id,
                scenario_id=get_scenario_id(session, row["scenario"]),
                year_analyzed=row["year_analyzed"],
                value=row["value"],
            )

            session.add(new_datapoint)
        session.commit()


# full_data = get_dataframe_from_file(FILE, int(Path(FILE).stem[3:7]))
# print(full_data)
# print(full_data.columns.tolist())
# report_path = Path(FILE)
# report_name = report_path.stem[:7]
# with Session(engine) as session:
#     report_id = get_report_id(session, report_name)
# print(report_id)

# populate_datapoints(full_data, report_id)
