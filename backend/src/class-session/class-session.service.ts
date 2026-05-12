import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClassSessionDto } from './dto/create-class-session.dto';
import { UpdateClassSessionDto } from './dto/update-class-session.dto';

@Injectable()
export class ClassSessionService {
  constructor(private prisma: PrismaService) {}

  async create(createClassSessionDto: CreateClassSessionDto) {
    return this.prisma.classSession.create({
      data: {
        ...createClassSessionDto,
        startTime: new Date(createClassSessionDto.startTime),
        endTime: new Date(createClassSessionDto.endTime),
      },
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

  async update(id: number, updateClassSessionDto: UpdateClassSessionDto) {
    const data: any = { ...updateClassSessionDto };
    if (updateClassSessionDto.startTime) {
      data.startTime = new Date(updateClassSessionDto.startTime);
    }
    if (updateClassSessionDto.endTime) {
      data.endTime = new Date(updateClassSessionDto.endTime);
    }

    return this.prisma.classSession.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.classSession.delete({
      where: { id },
    });
  }
}
