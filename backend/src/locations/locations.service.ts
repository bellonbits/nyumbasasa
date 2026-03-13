import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCounties() {
    const counties = await this.prisma.county.findMany({
      select: { id: true, name: true, slug: true, region: true, imageUrl: true },
      orderBy: { name: "asc" },
    });

    // Append listing counts
    const counts = await this.prisma.property.groupBy({
      by:    ["countyId"],
      where: { status: "ACTIVE" },
      _count: { _all: true },
    });

    const countMap = Object.fromEntries(counts.map((c) => [c.countyId, c._count._all]));
    return counties.map((c) => ({ ...c, listingCount: countMap[c.id] ?? 0 }));
  }

  async getTowns(countyId: string) {
    return this.prisma.town.findMany({
      where:   { countyId },
      select:  { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    });
  }

  async getEstates(townId: string) {
    return this.prisma.estate.findMany({
      where:   { townId },
      select:  { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    });
  }
}
