import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { BiometricService } from './biometric.service';
import { CreateBiometricDto } from './dto/create-biometric.dto';
import { UpdateBiometricDto } from './dto/update-biometric.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@UseGuards(AuthGuard('jwt'))
@Controller('biometric')
export class BiometricController {
  constructor(private readonly biometricService: BiometricService) {}

  @Post('upload-photo')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/profiles',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${uniqueSuffix}${ext}`);
      }
    })
  }))
  async uploadProfilePhoto(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const user = req.user;
    const { avatarUrl } = await this.biometricService.updateAvatar(user.userId, user.role, file.filename);
    
    return {
      message: 'Profile photo uploaded successfully',
      filename: file.filename,
      path: file.path,
      avatarUrl
    };
  }

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
