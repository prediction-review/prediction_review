from math import floor
import time
from pathlib import Path
import pandas as pd
import re


from sqlmodel import Session, select

# from app.core.db import engine
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

from UN_population import populate_datapoints

# 2000 fertility
# FILE = "../../data/WPP2000/WPP2000_EXCEL_FILES/DB01_Period_Indicators/WPP2000_DB1_F01_TOTAL_FERTILITY.xls"

# 2022 fertility
FILE = "../../data/WPP2022/EXCEL_FILES/1_General/WPP2022_GEN_F01_DEMOGRAPHIC_INDICATORS.xlsx"


def get_midyear(head: str) -> int:
    """
    takes in a string formatted as ####-#### and outputs the average of those two years (rounded down)
    """
    y1 = int(head[:4])
    y2 = int(head[-4:])
    return floor((y1 + y2) / 2)


def get_fertility_headers(
    dataframe: pd.DataFrame, header_row: int = 15, series_row: int = 16
):
    headers = dataframe.iloc[header_row].tolist()
    series = dataframe.iloc[series_row].tolist()

    header_list = []
    for head, ser in zip(headers, series):
        if pd.notna(ser):
            header_list.append(str(ser))
        else:
            header_list.append(str(head))
    return header_list


def read_fertility_sheet(file: str, sheetName: str) -> pd.DataFrame:
    df = pd.read_excel(file, sheet_name=sheetName, header=None, nrows=17)
    headers = get_fertility_headers(df)
    data = pd.read_excel(file, sheet_name=sheetName, header=None, skiprows=17)
    data.columns = headers
    return data


def get_dataframe_from_file(file: str, year: int):
    all_sheets = pd.ExcelFile(file).sheet_names
    sheets_to_read = all_sheets[:4]

    dfs = []
    for sheet in sheets_to_read:
        df = read_fertility_sheet(file, sheet)
        if year == 2000:
            df = df.rename(
                columns={
                    "Major area, region, country or area *": "region_name",
                    "Country code": "iso_num",
                }
            )

            year_columns = [col for col in df.columns if str(col).isdigit()]
            metadata_columns = [col for col in df.columns if not str(col).isdigit()]

            df = df.melt(
                id_vars=metadata_columns,
                value_vars=year_columns,
                var_name="year_analyzed",
                value_name="value",
            )

        if year == 2022:
            df = df.rename(
                columns={
                    "Region, subregion, country or area *": "region_name",
                    "Location code": "iso_num",
                    "Year": "year_analyzed",
                    "Total Fertility Rate (live births per woman)": "value",
                }
            )

            df = df.dropna(subset=["year_analyzed"])
            df = df[(df["value"] != "...")]

        df["year_analyzed"] = df["year_analyzed"].astype(int)
        df["value"] = df["value"].astype(float)

        df["datatype"] = "Fertility Rate"
        df["age_group"] = "None"
        df["gender"] = "Both"
        df["scenario"] = sheet

        dfs.append(df)

    dfs_combined = pd.concat(dfs, ignore_index=True)
    dfs_combined = dfs_combined.drop(["Index", "Notes"], axis=1)
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

    return dfs_combined


data = get_dataframe_from_file(FILE, 2022)
print(data)
populate_datapoints(data, 2)
