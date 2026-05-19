import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClassSessionDto } from './dto/create-class-session.dto';
import { UpdateClassSessionDto } from './dto/update-class-session.dto';

@Injectable()
export class ClassSessionService {
  constructor(private prisma: PrismaService) {}

  async create(createClassSessionDto: CreateClassSessionDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: createClassSessionDto.courseId }
    });
    if (!course) {
      throw new BadRequestException('Course not found');
    }
    const proposedStart = new Date(createClassSessionDto.startTime);
    const proposedEnd = new Date(createClassSessionDto.endTime);

    const overlapping = await this.prisma.classSession.findFirst({
      where: {
        course: {
          lecturerId: course.lecturerId
        },
        startTime: {
          lt: proposedEnd
        },
        endTime: {
          gt: proposedStart
        }
      }
    });
    if (overlapping) {
      throw new ConflictException('A class session is already scheduled for this lecturer during this time range');
    }

    return this.prisma.classSession.create({
      data: {
        ...createClassSessionDto,
        startTime: proposedStart,
        endTime: proposedEnd,
      },
    });
  }

  async findAll(user?: any) {
    if (user && user.role === 'student') {
      return this.prisma.classSession.findMany({
        where: {
          course: {
            enrollments: {
              some: {
                studentId: user.userId
              }
            }
          }
        },
        include: {
          course: true,
          attendances: true,
        }
      });
    }

    if (user && user.role === 'lecturer') {
      return this.prisma.classSession.findMany({
        where: {
          course: {
            lecturerId: user.userId
          }
        },
        include: {
          course: {
            include: {
              enrollments: {
                include: {
                  student: true
                }
              }
            }
          },
          attendances: true,
        }
      });
    }

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
    const current = await this.prisma.classSession.findUnique({
      where: { id },
      include: { course: true }
    });
    if (!current) {
      throw new NotFoundException('Class session not found');
    }

    const proposedStart = updateClassSessionDto.startTime ? new Date(updateClassSessionDto.startTime) : current.startTime;
    const proposedEnd = updateClassSessionDto.endTime ? new Date(updateClassSessionDto.endTime) : current.endTime;

    if (updateClassSessionDto.startTime || updateClassSessionDto.endTime) {
      const overlapping = await this.prisma.classSession.findFirst({
        where: {
          id: { not: id },
          course: {
            lecturerId: current.course.lecturerId
          },
          startTime: {
            lt: proposedEnd
          },
          endTime: {
            gt: proposedStart
          }
        }
      });
      if (overlapping) {
        throw new ConflictException('A class session is already scheduled for this lecturer during this time range');
      }
    }

    const data: any = { ...updateClassSessionDto };
    if (updateClassSessionDto.startTime) {
      data.startTime = proposedStart;
    }
    if (updateClassSessionDto.endTime) {
      data.endTime = proposedEnd;
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
