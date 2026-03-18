from fastapi import HTTPException, status

from app.database import db
from app.auth.schemas import RegisterSchema, LoginSchema
from app.auth.utils import hash_password, verify_password, create_tokens

_USER_SELECT = {
    "id": True, "name": True, "email": True, "phone": True,
    "role": True, "agencyName": True, "bio": True, "verified": True,
    "avatarUrl": True, "createdAt": True,
}


def _safe(user) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "role": user.role if isinstance(user.role, str) else user.role.value,
        "agencyName": user.agencyName,
        "bio": user.bio,
        "verified": user.verified,
        "avatarUrl": user.avatarUrl,
        "createdAt": user.createdAt.isoformat(),
    }


async def register(dto: RegisterSchema) -> dict:
    existing = await db.user.find_first(
        where={"OR": [{"email": dto.email}, {"phone": dto.phone}]}
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email or phone already registered",
        )

    hashed = hash_password(dto.password)
    user = await db.user.create(
        data={
            "name": dto.name,
            "email": dto.email,
            "phone": dto.phone,
            "agencyName": dto.agencyName,
            "password": hashed,
            "role": "AGENT",
        }
    )

    tokens = create_tokens(user.id, user.email, user.role if isinstance(user.role, str) else user.role.value)
    return {"user": _safe(user), "tokens": tokens}


async def login(dto: LoginSchema) -> dict:
    user = await db.user.find_unique(where={"email": dto.email})
    if not user or not user.active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    if not verify_password(dto.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    tokens = create_tokens(user.id, user.email, user.role if isinstance(user.role, str) else user.role.value)
    return {"user": _safe(user), "tokens": tokens}


async def get_me(user_id: str) -> dict:
    user = await db.user.find_unique(where={"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return _safe(user)


async def update_profile(user_id: str, data: dict) -> dict:
    update_data = {k: v for k, v in data.items() if v is not None}
    user = await db.user.update(where={"id": user_id}, data=update_data)
    return _safe(user)


async def change_password(user_id: str, current_password: str, new_password: str) -> dict:
    if len(new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters")

    user = await db.user.find_unique(where={"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(current_password, user.password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    hashed = hash_password(new_password)
    await db.user.update(where={"id": user_id}, data={"password": hashed})
    return {"changed": True}
