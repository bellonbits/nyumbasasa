from typing import Literal
from pydantic import BaseModel


class SearchListingSchema(BaseModel):
    county: str | None = None
    town: str | None = None
    estate: str | None = None
    houseType: str | None = None
    minRent: float | None = None
    maxRent: float | None = None
    page: int = 1
    limit: int = 12
    sortBy: Literal["createdAt", "rent", "viewCount"] = "createdAt"
    sortOrder: Literal["asc", "desc"] = "desc"


class CreateListingSchema(BaseModel):
    title: str
    description: str
    rent: float
    deposit: float
    houseType: str
    county: str
    town: str
    estate: str | None = None
    address: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    amenityIds: list[str] | None = None


class UpdateListingSchema(BaseModel):
    title: str | None = None
    description: str | None = None
    rent: float | None = None
    deposit: float | None = None
    houseType: str | None = None
    county: str | None = None
    town: str | None = None
    estate: str | None = None
    address: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    amenityIds: list[str] | None = None


class ReportSchema(BaseModel):
    reason: str
