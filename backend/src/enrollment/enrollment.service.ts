import { Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async create(createEnrollmentDto: CreateEnrollmentDto) {
    const { studentId, courseId } = createEnrollmentDto;
    const existing = await this.prisma.enrollment.findFirst({
       where: { studentId, courseId }
    });
    if (existing) {
       throw new Error('Already enrolled');
    }
    return this.prisma.enrollment.create({
      data: {
        studentId,
        courseId
      }
    });
  }

  async findAll() {
    return this.prisma.enrollment.findMany({
      include: {
        course: true,
        student: true,
      }
    });
  }

  async findByStudent(studentId: number) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
             lecturer: true,
             classSessions: true
          }
        }
      }
    });
    return enrollments.map((e: any) => e.course);
  }

  findOne(id: number) {
    return `This action returns a #${id} enrollment`;
  }

  update(id: number, updateEnrollmentDto: UpdateEnrollmentDto) {
    return `This action updates a #${id} enrollment`;
  }

  remove(id: number) {
    return `This action removes a #${id} enrollment`;
  }
}
