import re
from pydantic import BaseModel, EmailStr, field_validator


class RegisterSchema(BaseModel):
    name: str
    email: EmailStr
    phone: str
    agencyName: str | None = None
    password: str

    @field_validator("name")
    @classmethod
    def name_min_length(cls, v: str) -> str:
        if len(v) < 2:
            raise ValueError("Name must be at least 2 characters")
        return v

    @field_validator("phone")
    @classmethod
    def kenyan_phone(cls, v: str) -> str:
        if not re.match(r"^(?:\+254|0)[17]\d{8}$", v):
            raise ValueError("Enter a valid Kenyan phone number")
        return v

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class LoginSchema(BaseModel):
    email: EmailStr
    password: str


class UpdateProfileSchema(BaseModel):
    name: str | None = None
    phone: str | None = None
    agencyName: str | None = None


class ChangePasswordSchema(BaseModel):
    currentPassword: str
    newPassword: str
