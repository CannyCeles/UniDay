import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';

export class CreateBiometricDto {
  @IsNumber()
  @IsNotEmpty()
  studentId!: number;

  @IsObject()
  @IsNotEmpty()
  descriptor!: Record<string, any>;
}
