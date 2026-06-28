from sqlmodel import Field, SQLModel

class Region(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    region_name: str
    region_short: str | None = Field(default=None)
    parent_id: int | None = Field(default=None, foreign_key="region.id")
    iso2: str | None = Field(default=None)
    iso3: str | None = Field(default=None)
    iso_num: int | None = Field(default=None, unique=True)

class Source(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str