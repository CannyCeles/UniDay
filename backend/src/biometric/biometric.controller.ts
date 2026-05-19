import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { BiometricService } from './biometric.service';
import { CreateBiometricDto } from './dto/create-biometric.dto';
import { UpdateBiometricDto } from './dto/update-biometric.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

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
        const ext = path.extname(file.originalname);
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

  @Post('verify-face')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/profiles',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        callback(null, `verify-${uniqueSuffix}${ext}`);
      }
    })
  }))
  async verifyFace(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const user = req.user;
    console.log("verifyFace -> Verifying face for user PK ID:", user.userId);
    
    try {
      const result = await this.biometricService.verifyFace(user.userId, user.role, file.path);
      
      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (e) {
        console.error("verifyFace -> Temp file delete failed:", e);
      }

      return result;
    } catch (err: any) {
      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (e) {}
      throw err;
    }
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
