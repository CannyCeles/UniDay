import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsOptional()
  studentId?: string;

  @IsString()
  @IsOptional()
  lecturerId?: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsIn(['student', 'lecturer'])
  role!: 'student' | 'lecturer';
}
