import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { DashboardService } from "./dashboard.service";

@ApiTags("Dashboard")
@Controller("dashboard")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("stats")
  @ApiOperation({ summary: "Get agent stats" })
  async stats(@CurrentUser("id") agentId: string) {
    const data = await this.dashboardService.getStats(agentId);
    return { success: true, data };
  }

  @Get("listings")
  @ApiOperation({ summary: "Get agent listings with pagination" })
  async myListings(
    @CurrentUser("id") agentId: string,
    @Query("page") page = "1",
    @Query("limit") limit = "10",
  ) {
    return this.dashboardService.getMyListings(agentId, Number(page), Number(limit));
  }
}
