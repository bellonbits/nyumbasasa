from functools import lru_cache

from app.database import db


async def get_counties() -> list:
    counties = await db.county.find_many(order={"name": "asc"})
    return [
        {"id": c.id, "name": c.name, "slug": c.slug, "region": c.region, "imageUrl": c.imageUrl}
        for c in counties
    ]


async def get_towns(county_id: str) -> list:
    towns = await db.town.find_many(
        where={"countyId": county_id},
        order={"name": "asc"},
    )
    return [{"id": t.id, "name": t.name, "slug": t.slug} for t in towns]


async def get_estates(town_id: str) -> list:
    estates = await db.estate.find_many(
        where={"townId": town_id},
        order={"name": "asc"},
    )
    return [{"id": e.id, "name": e.name, "slug": e.slug} for e in estates]
