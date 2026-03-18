import asyncio
from datetime import datetime, timezone
from fastapi import HTTPException, UploadFile

from app.database import db
from app.listings.schemas import SearchListingSchema, CreateListingSchema, UpdateListingSchema

# ── Shared include shape ──────────────────────────────────────────────────────

_PROPERTY_INCLUDE = {
    "county": True,
    "town": True,
    "estate": True,
    "images": True,
    "agent": True,
    "amenities": {"include": {"amenity": True}},
}


def _transform(p) -> dict:
    """Serialize a Prisma property object to a plain dict."""
    d: dict = {
        "id": p.id,
        "title": p.title,
        "description": p.description,
        "rent": float(p.rent),
        "deposit": float(p.deposit),
        "houseType": p.houseType.value if hasattr(p.houseType, "value") else p.houseType,
        "status": p.status.value if hasattr(p.status, "value") else p.status,
        "isVerified": p.isVerified,
        "isBoosted": p.isBoosted,
        "address": p.address,
        "latitude": p.latitude,
        "longitude": p.longitude,
        "viewCount": p.viewCount,
        "expiresAt": p.expiresAt.isoformat() if p.expiresAt else None,
        "createdAt": p.createdAt.isoformat(),
        "updatedAt": p.updatedAt.isoformat(),
    }

    if p.county:
        d["county"] = {"id": p.county.id, "name": p.county.name, "slug": p.county.slug, "region": p.county.region}
    if p.town:
        d["town"] = {"id": p.town.id, "name": p.town.name, "slug": p.town.slug}
    if p.estate:
        d["estate"] = {"id": p.estate.id, "name": p.estate.name, "slug": p.estate.slug}
    if p.images:
        d["images"] = [{"id": img.id, "url": img.url, "publicId": img.publicId, "isPrimary": img.isPrimary} for img in p.images]
    else:
        d["images"] = []
    if p.agent:
        d["agent"] = {
            "id": p.agent.id, "name": p.agent.name, "phone": p.agent.phone,
            "whatsapp": p.agent.whatsapp, "agencyName": p.agent.agencyName,
            "verified": p.agent.verified, "avatarUrl": p.agent.avatarUrl,
        }
    d["amenities"] = [a.amenity.__dict__ for a in p.amenities] if p.amenities else []

    return d


def _slugify(text: str) -> str:
    import re
    return re.sub(r"[^\w-]+", "", text.lower().replace(" ", "-"))


async def search(dto: SearchListingSchema) -> dict:
    now = datetime.now(timezone.utc)
    where: dict = {
        "status": "ACTIVE",
        "expiresAt": {"gte": now},
    }

    if dto.county:
        where["county"] = {"name": {"contains": dto.county, "mode": "insensitive"}}
    if dto.town:
        where["town"] = {"name": {"contains": dto.town, "mode": "insensitive"}}
    if dto.estate:
        where["estate"] = {"name": {"contains": dto.estate, "mode": "insensitive"}}
    if dto.houseType:
        where["houseType"] = dto.houseType.upper()

    rent_filter: dict = {}
    if dto.minRent is not None:
        rent_filter["gte"] = dto.minRent
    if dto.maxRent is not None:
        rent_filter["lte"] = dto.maxRent
    if rent_filter:
        where["rent"] = rent_filter

    order = {dto.sortBy: dto.sortOrder}

    total, data = await asyncio.gather(
        db.property.count(where=where),
        db.property.find_many(
            where=where,
            include=_PROPERTY_INCLUDE,
            order=order,
            skip=(dto.page - 1) * dto.limit,
            take=dto.limit,
        ),
    )

    return {
        "data": [_transform(p) for p in data],
        "meta": {
            "total": total,
            "page": dto.page,
            "limit": dto.limit,
            "totalPages": -(-total // dto.limit),  # ceiling division
        },
    }


async def get_featured() -> list:
    data = await db.property.find_many(
        where={"status": "ACTIVE", "isVerified": True},
        include=_PROPERTY_INCLUDE,
        order=[{"isBoosted": "desc"}, {"viewCount": "desc"}],
        take=6,
    )
    return [_transform(p) for p in data]


async def get_by_id(property_id: str) -> dict:
    p = await db.property.find_unique(where={"id": property_id}, include=_PROPERTY_INCLUDE)
    if not p:
        raise HTTPException(status_code=404, detail="Property not found")
    return _transform(p)


async def create(agent_id: str, dto: CreateListingSchema, files: list[UploadFile]) -> dict:
    if not files:
        raise HTTPException(status_code=400, detail="At least one photo is required")

    # Resolve county
    county = await db.county.find_first(
        where={"name": {"contains": dto.county, "mode": "insensitive"}}
    )
    if not county:
        raise HTTPException(status_code=400, detail=f'County "{dto.county}" not found')

    # Resolve / create town
    town = await db.town.find_first(
        where={"countyId": county.id, "name": {"contains": dto.town, "mode": "insensitive"}}
    )
    if not town:
        town = await db.town.create(
            data={"name": dto.town, "slug": _slugify(dto.town), "countyId": county.id}
        )

    # Resolve / create estate
    estate_id: str | None = None
    if dto.estate:
        estate = await db.estate.find_first(
            where={"townId": town.id, "name": {"contains": dto.estate, "mode": "insensitive"}}
        )
        if not estate:
            estate = await db.estate.create(
                data={"name": dto.estate, "slug": _slugify(dto.estate), "townId": town.id}
            )
        estate_id = estate.id

    # Upload images to Cloudinary
    from app.cloudinary_svc.service import upload_image
    uploaded = []
    for i, f in enumerate(files):
        result = await upload_image(f, folder="nyumbasasa")
        uploaded.append({"url": result["secure_url"], "publicId": result["public_id"], "isPrimary": i == 0})

    create_data: dict = {
        "title": dto.title,
        "description": dto.description,
        "rent": dto.rent,
        "deposit": dto.deposit,
        "houseType": dto.houseType.upper(),
        "address": dto.address,
        "latitude": dto.latitude,
        "longitude": dto.longitude,
        "countyId": county.id,
        "townId": town.id,
        "agentId": agent_id,
        "images": {"create": uploaded},
    }
    if estate_id:
        create_data["estateId"] = estate_id
    if dto.amenityIds:
        create_data["amenities"] = {
            "create": [{"amenityId": aid} for aid in dto.amenityIds]
        }

    p = await db.property.create(data=create_data, include=_PROPERTY_INCLUDE)
    return _transform(p)


async def update(
    property_id: str,
    agent_id: str,
    role: str,
    dto: UpdateListingSchema,
    files: list[UploadFile],
) -> dict:
    existing = await db.property.find_unique(where={"id": property_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")
    if existing.agentId != agent_id and role != "ADMIN":
        raise HTTPException(status_code=403, detail="You can only edit your own listings")

    update_data: dict = {"status": "PENDING"}

    if dto.title:        update_data["title"]       = dto.title
    if dto.description:  update_data["description"] = dto.description
    if dto.rent:         update_data["rent"]         = dto.rent
    if dto.deposit is not None: update_data["deposit"] = dto.deposit
    if dto.houseType:    update_data["houseType"]   = dto.houseType.upper()
    if dto.address:      update_data["address"]     = dto.address
    if dto.latitude:     update_data["latitude"]    = dto.latitude
    if dto.longitude:    update_data["longitude"]   = dto.longitude

    # Resolve location if provided
    if dto.county:
        county = await db.county.find_first(
            where={"name": {"contains": dto.county, "mode": "insensitive"}}
        )
        if not county:
            raise HTTPException(status_code=400, detail=f'County "{dto.county}" not found')
        update_data["countyId"] = county.id

        if dto.town:
            town = await db.town.find_first(
                where={"countyId": county.id, "name": {"contains": dto.town, "mode": "insensitive"}}
            )
            if not town:
                town = await db.town.create(
                    data={"name": dto.town, "slug": _slugify(dto.town), "countyId": county.id}
                )
            update_data["townId"] = town.id

            if dto.estate:
                estate = await db.estate.find_first(
                    where={"townId": town.id, "name": {"contains": dto.estate, "mode": "insensitive"}}
                )
                if not estate:
                    estate = await db.estate.create(
                        data={"name": dto.estate, "slug": _slugify(dto.estate), "townId": town.id}
                    )
                update_data["estateId"] = estate.id

    # Upload new images if any
    if files:
        from app.cloudinary_svc.service import upload_image
        for f in files:
            result = await upload_image(f, folder="nyumbasasa")
            await db.propertyimage.create(
                data={"url": result["secure_url"], "publicId": result["public_id"], "isPrimary": False, "propertyId": property_id}
            )

    p = await db.property.update(where={"id": property_id}, data=update_data, include=_PROPERTY_INCLUDE)
    return _transform(p)


async def delete(property_id: str, agent_id: str, role: str) -> dict:
    existing = await db.property.find_unique(where={"id": property_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")
    if existing.agentId != agent_id and role != "ADMIN":
        raise HTTPException(status_code=403, detail="You can only delete your own listings")

    images = await db.propertyimage.find_many(where={"propertyId": property_id})
    from app.cloudinary_svc.service import destroy_image
    for img in images:
        await destroy_image(img.publicId)

    await db.property.delete(where={"id": property_id})
    return {"deleted": True}


async def increment_view(property_id: str) -> None:
    await db.property.update(
        where={"id": property_id},
        data={"viewCount": {"increment": 1}},
    )


async def report(property_id: str, reporter_id: str, reason: str) -> dict:
    p = await db.property.find_unique(where={"id": property_id})
    if not p:
        raise HTTPException(status_code=404, detail="Property not found")
    await db.listingreport.create(
        data={"propertyId": property_id, "reporterId": reporter_id, "reason": reason}
    )
    return {"reported": True}


async def get_my_listings(agent_id: str, page: int = 1, limit: int = 10) -> dict:
    where = {"agentId": agent_id}
    total, data = await asyncio.gather(
        db.property.count(where=where),
        db.property.find_many(
            where=where,
            include=_PROPERTY_INCLUDE,
            order={"createdAt": "desc"},
            skip=(page - 1) * limit,
            take=limit,
        ),
    )
    return {
        "data": [_transform(p) for p in data],
        "meta": {"total": total, "page": page, "limit": limit, "totalPages": -(-total // limit)},
    }
