import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateLecturerDto {
  @IsString()
  @IsNotEmpty()
  lecturerId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
