import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsIn(['student', 'lecturer'])
  role!: 'student' | 'lecturer';
}
