import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ListingsService } from "../listings/listings.service";

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly listingsService: ListingsService,
  ) {}

  async getStats(agentId: string) {
    const [totalListings, activeListings, viewAgg, expiringListings] = await Promise.all([
      this.prisma.property.count({ where: { agentId } }),
      this.prisma.property.count({ where: { agentId, status: "ACTIVE" } }),
      this.prisma.property.aggregate({
        where: { agentId },
        _sum:  { viewCount: true },
      }),
      this.prisma.property.count({
        where: {
          agentId,
          status:    "ACTIVE",
          expiresAt: { lte: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return {
      totalListings,
      activeListings,
      totalViews: viewAgg._sum.viewCount ?? 0,
      expiringListings,
    };
  }

  async getMyListings(agentId: string, page: number, limit: number) {
    return this.listingsService.getMyListings(agentId, page, limit);
  }
}
