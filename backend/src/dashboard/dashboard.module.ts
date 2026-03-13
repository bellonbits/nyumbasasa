import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { ListingsModule } from "../listings/listings.module";

@Module({
  imports:     [ListingsModule],
  controllers: [DashboardController],
  providers:   [DashboardService],
})
export class DashboardModule {}
