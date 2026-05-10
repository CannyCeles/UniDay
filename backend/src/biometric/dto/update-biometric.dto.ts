import { PartialType } from '@nestjs/mapped-types';
import { CreateBiometricDto } from './create-biometric.dto';

export class UpdateBiometricDto extends PartialType(CreateBiometricDto) {}
