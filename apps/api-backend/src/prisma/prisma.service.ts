import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma } from '@turnia/db';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // Expose the raw prisma client instance
  public client = prisma;

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
