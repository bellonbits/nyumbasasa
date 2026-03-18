from fastapi import APIRouter, Depends

from app.auth import schemas, service
from app.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", status_code=201)
async def register(dto: schemas.RegisterSchema):
    data = await service.register(dto)
    return {"success": True, "data": data}


@router.post("/login")
async def login(dto: schemas.LoginSchema):
    data = await service.login(dto)
    return {"success": True, "data": data}


@router.get("/me")
async def me(current_user: dict = Depends(get_current_user)):
    data = await service.get_me(current_user["id"])
    return {"success": True, "data": data}


@router.patch("/profile")
async def update_profile(
    dto: schemas.UpdateProfileSchema,
    current_user: dict = Depends(get_current_user),
):
    data = await service.update_profile(current_user["id"], dto.model_dump(exclude_none=True))
    return {"success": True, "data": data}


@router.patch("/password")
async def change_password(
    dto: schemas.ChangePasswordSchema,
    current_user: dict = Depends(get_current_user),
):
    data = await service.change_password(
        current_user["id"], dto.currentPassword, dto.newPassword
    )
    return {"success": True, "data": data}


@router.post("/logout")
async def logout():
    return {"success": True, "message": "Logged out"}
