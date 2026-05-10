import { Injectable } from '@nestjs/common';
import { CreateBiometricDto } from './dto/create-biometric.dto';
import { UpdateBiometricDto } from './dto/update-biometric.dto';

@Injectable()
export class BiometricService {
  create(createBiometricDto: CreateBiometricDto) {
    return 'This action adds a new biometric';
  }

  findAll() {
    return `This action returns all biometric`;
  }

  findOne(id: number) {
    return `This action returns a #${id} biometric`;
  }

  update(id: number, updateBiometricDto: UpdateBiometricDto) {
    return `This action updates a #${id} biometric`;
  }

  remove(id: number) {
    return `This action removes a #${id} biometric`;
  }
}
