import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { CreateStudentDto } from '../student/dto/create-student.dto';
import { CreateLecturerDto } from '../lecturer/dto/create-lecturer.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerStudent(dto: CreateStudentDto) {
    const existing = await this.prisma.student.findUnique({
      where: { studentId: dto.studentId }
    });
    if (existing) throw new ConflictException('Student ID already exists');

    const emailExisting = await this.prisma.student.findUnique({
      where: { email: dto.email }
    });
    if (emailExisting) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.student.create({
      data: {
        studentId: dto.studentId,
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      },
    });

    return { message: 'Student registered successfully', user: { id: user.id, studentId: user.studentId } };
  }

  async registerLecturer(dto: CreateLecturerDto) {
    const existing = await this.prisma.lecturer.findUnique({
      where: { lecturerId: dto.lecturerId }
    });
    if (existing) throw new ConflictException('Lecturer ID already exists');

    const emailExisting = await this.prisma.lecturer.findUnique({
      where: { email: dto.email }
    });
    if (emailExisting) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.lecturer.create({
      data: {
        lecturerId: dto.lecturerId,
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      },
    });

    return { message: 'Lecturer registered successfully', user: { id: user.id, lecturerId: user.lecturerId } };
  }

  async login(dto: LoginDto) {
    let user;
    if (dto.role === 'student') {
      if (!dto.studentId) throw new UnauthorizedException('Student ID is required');
      user = await this.prisma.student.findUnique({ where: { studentId: dto.studentId } });
    } else {
      if (!dto.lecturerId) throw new UnauthorizedException('Lecturer ID is required');
      user = await this.prisma.lecturer.findUnique({ where: { lecturerId: dto.lecturerId } });
    }

    if (!user) throw new UnauthorizedException('Invalid ID');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, role: dto.role, name: user.name, email: user.email };
    const userId = dto.role === 'student' ? (user as any).studentId : (user as any).lecturerId;
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userId: userId,
        role: dto.role
      }
    };
  }
}
