import { Injectable} from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient {
  constructor() {
    const port = parseInt(process.env.DB_PORT ?? '3306');
    const isCloud = process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1';
    
    const adapter = new PrismaMariaDb({
      host: process.env.DB_HOST ?? 'localhost',
      port: port,
      user: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_NAME ?? 'uniday_db',
      ssl: isCloud ? { rejectUnauthorized: false } : undefined,
    });

    super({ adapter : adapter});
  }
}
