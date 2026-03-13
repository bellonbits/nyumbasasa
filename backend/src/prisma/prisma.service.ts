import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /** Soft-clean for test environments */
  async cleanDatabase() {
    if (process.env.NODE_ENV !== "test") return;
    const models = Reflect.ownKeys(this).filter((k) => k !== "_dmmf");
    await Promise.all(models.map((m) => (this as any)[m]?.deleteMany?.()));
  }
}
