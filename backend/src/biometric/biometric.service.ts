import { Injectable } from '@nestjs/common';
import { CreateBiometricDto } from './dto/create-biometric.dto';
import { UpdateBiometricDto } from './dto/update-biometric.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BiometricService {
  constructor(private prisma: PrismaService) {}

  async updateAvatar(userId: number, role: string, filename: string) {
    const avatarUrl = `/uploads/profiles/${filename}`;
    if (role === 'student') {
      await this.prisma.student.update({
        where: { id: userId },
        data: { avatarUrl },
      });
    } else if (role === 'lecturer') {
      await this.prisma.lecturer.update({
        where: { id: userId },
        data: { avatarUrl },
      });
    }
    return { avatarUrl };
  }

  create(createBiometricDto: CreateBiometricDto) {
    return 'This action adds a new biometric';
  }

  findAll() {
    return `This action returns all biometric`;
  }

  findOne(id: number) {
    return `This action returns a #${id} biometric`;
  }

  update(id: number, updateBiometricDto: UpdateBiometricDto) {
    return `This action updates a #${id} biometric`;
  }

  remove(id: number) {
    return `This action removes a #${id} biometric`;
  }
}
