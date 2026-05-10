import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateClassSessionDto {
  @IsNumber()
  @IsNotEmpty()
  courseId!: number;

  @IsDateString()
  @IsNotEmpty()
  startTime!: string;

  @IsDateString()
  @IsNotEmpty()
  endTime!: string;
}
