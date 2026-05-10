import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CheckInDto {
  @IsNumber()
  @IsNotEmpty()
  sessionId!: number;

  @IsString()
  @IsNotEmpty()
  image!: string; 
}
