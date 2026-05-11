import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateStudentDto } from '../student/dto/create-student.dto';
import { CreateLecturerDto } from '../lecturer/dto/create-lecturer.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/student')
  registerStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.authService.registerStudent(createStudentDto);
  }

  @Post('register/lecturer')
  registerLecturer(@Body() createLecturerDto: CreateLecturerDto) {
    return this.authService.registerLecturer(createLecturerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
