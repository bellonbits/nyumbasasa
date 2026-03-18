from fastapi import APIRouter

from app.locations import service

router = APIRouter(prefix="/locations", tags=["Locations"])


@router.get("/counties")
async def list_counties():
    data = await service.get_counties()
    return {"success": True, "data": data}


@router.get("/counties/{county_id}/towns")
async def list_towns(county_id: str):
    data = await service.get_towns(county_id)
    return {"success": True, "data": data}


@router.get("/towns/{town_id}/estates")
async def list_estates(town_id: str):
    data = await service.get_estates(town_id)
    return {"success": True, "data": data}
