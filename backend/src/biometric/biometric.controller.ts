import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BiometricService } from './biometric.service';
import { CreateBiometricDto } from './dto/create-biometric.dto';
import { UpdateBiometricDto } from './dto/update-biometric.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('biometric')
export class BiometricController {
  constructor(private readonly biometricService: BiometricService) {}

  @Post()
  create(@Body() createBiometricDto: CreateBiometricDto) {
    return this.biometricService.create(createBiometricDto);
  }

  @Get()
  findAll() {
    return this.biometricService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.biometricService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBiometricDto: UpdateBiometricDto) {
    return this.biometricService.update(+id, updateBiometricDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.biometricService.remove(+id);
  }
}
