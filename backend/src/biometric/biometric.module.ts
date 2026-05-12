import { Module } from '@nestjs/common';
import { BiometricService } from './biometric.service';
import { BiometricController } from './biometric.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [BiometricController],
  providers: [BiometricService, PrismaService],
})
export class BiometricModule {}
