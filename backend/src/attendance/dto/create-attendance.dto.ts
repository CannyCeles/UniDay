import { IsInt, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAttendanceDto {
  @IsInt()
  sessionId: number;

  @IsInt()
  studentId: number;

  @IsString()
  status: string;

  @IsNumber()
  @IsOptional()
  matchScore?: number;
}
