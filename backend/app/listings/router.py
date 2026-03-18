from fastapi import APIRouter, Depends, Query, UploadFile, File, Form, HTTPException
from typing import Annotated

from app.listings import schemas, service
from app.dependencies import get_current_user

router = APIRouter(prefix="/properties", tags=["Listings"])

MAX_IMAGES = 8
MAX_SIZE_MB = 5


# ── Public ──────────────────────────────────────────────────────────────────

@router.get("")
async def search_listings(
    county: str | None = Query(None),
    town: str | None = Query(None),
    estate: str | None = Query(None),
    houseType: str | None = Query(None),
    minRent: float | None = Query(None),
    maxRent: float | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=50),
    sortBy: str = Query("createdAt"),
    sortOrder: str = Query("desc"),
):
    dto = schemas.SearchListingSchema(
        county=county, town=town, estate=estate,
        houseType=houseType, minRent=minRent, maxRent=maxRent,
        page=page, limit=limit, sortBy=sortBy, sortOrder=sortOrder,
    )
    data = await service.search(dto)
    return {"success": True, **data}


@router.get("/featured")
async def get_featured():
    data = await service.get_featured()
    return {"success": True, "data": data}


@router.get("/{property_id}")
async def get_property(property_id: str):
    data = await service.get_by_id(property_id)
    return {"success": True, "data": data}


@router.post("/{property_id}/view", status_code=204)
async def view_property(property_id: str):
    await service.increment_view(property_id)


@router.post("/{property_id}/report")
async def report_property(
    property_id: str,
    dto: schemas.ReportSchema,
    current_user: dict = Depends(get_current_user),
):
    data = await service.report(property_id, current_user["id"], dto.reason)
    return {"success": True, "data": data}


# ── Protected ────────────────────────────────────────────────────────────────

def _validate_files(files: list[UploadFile]) -> list[UploadFile]:
    if len(files) > MAX_IMAGES:
        raise HTTPException(400, f"Maximum {MAX_IMAGES} images allowed")
    for f in files:
        if f.size and f.size > MAX_SIZE_MB * 1024 * 1024:
            raise HTTPException(400, f"Each image must be under {MAX_SIZE_MB}MB")
    return files


@router.post("", status_code=201)
async def create_listing(
    title: Annotated[str, Form()],
    description: Annotated[str, Form()],
    rent: Annotated[float, Form()],
    deposit: Annotated[float, Form()],
    houseType: Annotated[str, Form()],
    county: Annotated[str, Form()],
    town: Annotated[str, Form()],
    estate: Annotated[str | None, Form()] = None,
    address: Annotated[str | None, Form()] = None,
    latitude: Annotated[float | None, Form()] = None,
    longitude: Annotated[float | None, Form()] = None,
    amenityIds: Annotated[str | None, Form()] = None,
    images: list[UploadFile] = File(...),
    current_user: dict = Depends(get_current_user),
):
    _validate_files(images)
    dto = schemas.CreateListingSchema(
        title=title, description=description, rent=rent, deposit=deposit,
        houseType=houseType, county=county, town=town, estate=estate,
        address=address, latitude=latitude, longitude=longitude,
        amenityIds=amenityIds.split(",") if amenityIds else None,
    )
    data = await service.create(current_user["id"], dto, images)
    return {"success": True, "data": data}


@router.patch("/{property_id}")
async def update_listing(
    property_id: str,
    title: Annotated[str | None, Form()] = None,
    description: Annotated[str | None, Form()] = None,
    rent: Annotated[float | None, Form()] = None,
    deposit: Annotated[float | None, Form()] = None,
    houseType: Annotated[str | None, Form()] = None,
    county: Annotated[str | None, Form()] = None,
    town: Annotated[str | None, Form()] = None,
    estate: Annotated[str | None, Form()] = None,
    address: Annotated[str | None, Form()] = None,
    latitude: Annotated[float | None, Form()] = None,
    longitude: Annotated[float | None, Form()] = None,
    images: list[UploadFile] = File(default=[]),
    current_user: dict = Depends(get_current_user),
):
    if images:
        _validate_files(images)
    dto = schemas.UpdateListingSchema(
        title=title, description=description, rent=rent, deposit=deposit,
        houseType=houseType, county=county, town=town, estate=estate,
        address=address, latitude=latitude, longitude=longitude,
    )
    data = await service.update(property_id, current_user["id"], current_user["role"], dto, images)
    return {"success": True, "data": data}


@router.delete("/{property_id}")
async def delete_listing(
    property_id: str,
    current_user: dict = Depends(get_current_user),
):
    data = await service.delete(property_id, current_user["id"], current_user["role"])
    return {"success": True, "data": data}
