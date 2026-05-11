import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClassSessionService {
  constructor(private prisma: PrismaService) {}

  async create(createClassSessionDto: any) {
    return this.prisma.classSession.create({
      data: createClassSessionDto,
    });
  }

  async findAll() {
    return this.prisma.classSession.findMany({
      include: {
        course: true,
        attendances: true,
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.classSession.findUnique({
      where: { id },
      include: {
        course: true,
        attendances: true,
      }
    });
  }

  async update(id: number, updateClassSessionDto: any) {
    return this.prisma.classSession.update({
      where: { id },
      data: updateClassSessionDto,
    });
  }

  async remove(id: number) {
    return this.prisma.classSession.delete({
      where: { id },
    });
  }
}
