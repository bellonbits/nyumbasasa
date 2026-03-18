from fastapi import APIRouter, Depends, Query

from app.dashboard import service
from app.dependencies import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
async def dashboard_stats(current_user: dict = Depends(get_current_user)):
    data = await service.get_stats(current_user["id"])
    return {"success": True, "data": data}


@router.get("/listings")
async def dashboard_listings(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    current_user: dict = Depends(get_current_user),
):
    data = await service.get_dashboard_listings(current_user["id"], page, limit)
    return {"success": True, **data}
