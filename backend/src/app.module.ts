import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ListingsModule } from "./listings/listings.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { LocationsModule } from "./locations/locations.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]), // 60 req/min globally
    PrismaModule,
    AuthModule,
    ListingsModule,
    DashboardModule,
    LocationsModule,
    CloudinaryModule,
  ],
  providers: [
    // Apply rate limiting globally
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
