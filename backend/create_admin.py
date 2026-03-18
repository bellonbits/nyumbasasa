"""
Run once to seed the admin account.
Usage: python create_admin.py
"""
import asyncio
from prisma import Prisma
from passlib.context import CryptContext

pwd = CryptContext(schemes=["argon2"], deprecated="auto")

ADMIN = {
    "name":      "Admin",
    "email":     "admin@nyumbasasa.co.ke",
    "phone":     "0700000000",
    "password":  "Admin@2026!",   # change after first login
    "role":      "ADMIN",
    "verified":  True,
}

async def main():
    db = Prisma()
    await db.connect()

    existing = await db.user.find_unique(where={"email": ADMIN["email"]})
    if existing:
        print(f"✓ Admin already exists: {ADMIN['email']}")
        await db.disconnect()
        return

    user = await db.user.create(data={
        "name":     ADMIN["name"],
        "email":    ADMIN["email"],
        "phone":    ADMIN["phone"],
        "password": pwd.hash(ADMIN["password"]),
        "role":     ADMIN["role"],
        "verified": ADMIN["verified"],
    })

    print("✓ Admin account created")
    print(f"  Email   : {user.email}")
    print(f"  Password: {ADMIN['password']}")
    print(f"  ID      : {user.id}")
    print("\n⚠  Change the password after first login!")

    await db.disconnect()

asyncio.run(main())
