import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
    return this.prisma.attendanceRecord.upsert({
      where: {
        sessionId_studentId: {
          sessionId: createAttendanceDto.sessionId,
          studentId: createAttendanceDto.studentId,
        },
      },
      update: {
        status: createAttendanceDto.status,
        matchScore: createAttendanceDto.matchScore,
        timestamp: new Date(),
      },
      create: {
        sessionId: createAttendanceDto.sessionId,
        studentId: createAttendanceDto.studentId,
        status: createAttendanceDto.status,
        matchScore: createAttendanceDto.matchScore,
      },
    });
  }

  async findAll() {
    return this.prisma.attendanceRecord.findMany({
      include: {
        student: true,
        session: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.attendanceRecord.findUnique({
      where: { id },
      include: {
        student: true,
        session: true,
      },
    });
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    return this.prisma.attendanceRecord.update({
      where: { id },
      data: updateAttendanceDto as any,
    });
  }

  async remove(id: number) {
    return this.prisma.attendanceRecord.delete({
      where: { id },
    });
  }
}
