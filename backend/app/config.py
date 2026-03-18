from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_ACCESS_EXPIRES: str = "1d"
    JWT_REFRESH_EXPIRES: str = "7d"
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    FRONTEND_URL: str = "http://localhost:3000"
    PORT: int = 3001

    model_config = {"env_file": ".env", "case_sensitive": True, "extra": "ignore"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
