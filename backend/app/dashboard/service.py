import asyncio
from datetime import datetime, timezone, timedelta

from app.database import db
from app.listings.service import get_my_listings


async def get_stats(agent_id: str) -> dict:
    now = datetime.now(timezone.utc)
    expiry_threshold = now + timedelta(days=5)

    total, active, expiring, view_rows = await asyncio.gather(
        db.property.count(where={"agentId": agent_id}),
        db.property.count(where={"agentId": agent_id, "status": "ACTIVE"}),
        db.property.count(
            where={
                "agentId": agent_id,
                "status": "ACTIVE",
                "expiresAt": {"lte": expiry_threshold},
            }
        ),
        db.query_raw(
            'SELECT COALESCE(SUM("viewCount"), 0)::int AS total FROM properties WHERE "agentId" = $1',
            agent_id,
        ),
    )

    total_views = view_rows[0]["total"] if view_rows else 0

    return {
        "totalListings": total,
        "activeListings": active,
        "totalViews": total_views,
        "expiringListings": expiring,
    }


async def get_dashboard_listings(agent_id: str, page: int, limit: int) -> dict:
    return await get_my_listings(agent_id, page, limit)
