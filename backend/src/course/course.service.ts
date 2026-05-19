import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: any) {
    return this.prisma.course.create({
      data: createCourseDto,
    });
  }

  async findAll() {
    return this.prisma.course.findMany({
      include: {
        lecturer: true,
        classSessions: true,
        enrollments: true,
      }
    });
  }

  async findByLecturer(lecturerId: number) {
    return this.prisma.course.findMany({
      where: { lecturerId },
      include: {
        lecturer: true,
        classSessions: true,
        enrollments: true,
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        lecturer: true,
        classSessions: true,
      }
    });
  }

  async update(id: number, updateCourseDto: any) {
    return this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
    });
  }

  async remove(id: number) {
    return this.prisma.course.delete({
      where: { id },
    });
  }
}
