from datetime import datetime, timezone, timedelta
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import get_settings

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def _parse_duration(s: str) -> int:
    """Convert duration string like '1d', '7d', '24h' to seconds."""
    if s.endswith("d"):
        return int(s[:-1]) * 86400
    if s.endswith("h"):
        return int(s[:-1]) * 3600
    if s.endswith("m"):
        return int(s[:-1]) * 60
    return int(s)


def create_tokens(user_id: str, email: str, role: str) -> dict[str, str]:
    settings = get_settings()
    payload: dict[str, Any] = {
        "sub": user_id,
        "email": email,
        "role": role,
    }

    access_exp = timedelta(seconds=_parse_duration(settings.JWT_ACCESS_EXPIRES))
    refresh_exp = timedelta(seconds=_parse_duration(settings.JWT_REFRESH_EXPIRES))

    now = datetime.now(timezone.utc)

    access_token = jwt.encode(
        {**payload, "exp": now + access_exp, "iat": now},
        settings.JWT_SECRET,
        algorithm="HS256",
    )
    refresh_token = jwt.encode(
        {**payload, "exp": now + refresh_exp, "iat": now},
        settings.JWT_SECRET,
        algorithm="HS256",
    )

    return {"accessToken": access_token, "refreshToken": refresh_token}


def decode_token(token: str) -> dict[str, Any] | None:
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        return payload
    except JWTError:
        return None
