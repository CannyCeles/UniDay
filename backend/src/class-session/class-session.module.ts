import { Module } from '@nestjs/common';
import { ClassSessionService } from './class-session.service';
import { ClassSessionController } from './class-session.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ClassSessionController],
  providers: [ClassSessionService, PrismaService],
})
export class ClassSessionModule {}
