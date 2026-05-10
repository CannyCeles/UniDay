import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { LecturerModule } from './lecturer/lecturer.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { ClassSessionModule } from './class-session/class-session.module';
import { BiometricModule } from './biometric/biometric.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [AuthModule, StudentModule, LecturerModule, CourseModule, EnrollmentModule, ClassSessionModule, BiometricModule, AttendanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
