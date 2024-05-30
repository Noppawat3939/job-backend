import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const { DB_RUN } = process.env;

@Injectable()
export class DbService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();

      console.log(`Connnected database on ${DB_RUN}`);
    } catch (error) {
      console.log('Connect database failed');
    }
  }
}
