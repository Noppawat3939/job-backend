import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DbService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();

      console.log('✅ Connnected DB');
    } catch (error) {
      console.log('Connect DB failed');
    }
  }
}
