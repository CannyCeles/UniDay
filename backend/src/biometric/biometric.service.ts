import { Injectable } from '@nestjs/common';
import { CreateBiometricDto } from './dto/create-biometric.dto';
import { UpdateBiometricDto } from './dto/update-biometric.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as faceapi from 'face-api.js';
import { Canvas, Image, ImageData, loadImage } from 'canvas';

@Injectable()
export class BiometricService {
  constructor(private prisma: PrismaService) {}

  private modelsLoaded = false;

  async updateAvatar(userId: number, role: string, filename: string) {
    const avatarUrl = `/uploads/profiles/${filename}`;
    if (role === 'student') {
      await this.prisma.student.update({
        where: { id: userId },
        data: { avatarUrl },
      });
    } else if (role === 'lecturer') {
      await this.prisma.lecturer.update({
        where: { id: userId },
        data: { avatarUrl },
      });
    }
    return { avatarUrl };
  }

  private async ensureModelsExist() {
    const modelDir = path.join(process.cwd(), 'weights');
    if (!fs.existsSync(modelDir)) {
      fs.mkdirSync(modelDir, { recursive: true });
    }

    const files = [
      'ssd_mobilenetv1_model-weights_manifest.json',
      'ssd_mobilenetv1_model-shard1',
      'ssd_mobilenetv1_model-shard2',
      'tiny_face_detector_model-weights_manifest.json',
      'tiny_face_detector_model-shard1',
      'face_landmark_68_model-weights_manifest.json',
      'face_landmark_68_model-shard1',
      'face_recognition_model-weights_manifest.json',
      'face_recognition_model-shard1',
      'face_recognition_model-shard2'
    ];

    const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';

    for (const file of files) {
      const filePath = path.join(modelDir, file);
      if (!fs.existsSync(filePath)) {
        console.log(`ensureModelsExist -> Downloading ${file}`);
        await this.downloadFile(baseUrl + file, filePath);
      }
    }
  }

  private async downloadFile(url: string, dest: string) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to download ${url}: ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.promises.writeFile(dest, buffer);
  }

  private async ensureModelsLoaded() {
    if (this.modelsLoaded) return;

    console.log("ensureModelsLoaded -> Initializing models");
    await this.ensureModelsExist();

    const modelDir = path.join(process.cwd(), 'weights');
    
    const faceapiEnv = faceapi.env;
    faceapiEnv.monkeyPatch({ Canvas: Canvas as any, Image: Image as any, ImageData: ImageData as any });

    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelDir);
    await faceapi.nets.tinyFaceDetector.loadFromDisk(modelDir);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelDir);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelDir);

    this.modelsLoaded = true;
    console.log("ensureModelsLoaded -> Models loaded successfully!");
  }

  private async getFaceDescriptor(imagePath: string): Promise<Float32Array | null> {
    try {
      const img = await loadImage(imagePath) as any;
      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
      return detection ? detection.descriptor : null;
    } catch (error) {
      console.error(`getFaceDescriptor -> Error reading ${imagePath}:`, error);
      return null;
    }
  }

  async verifyFace(userId: number, role: string, tempFilePath: string) {
    let userRecord: any;
    if (role === 'student') {
      userRecord = await this.prisma.student.findUnique({ where: { id: userId } });
    } else {
      userRecord = await this.prisma.lecturer.findUnique({ where: { id: userId } });
    }

    if (!userRecord || !userRecord.avatarUrl) {
      throw new Error('Please upload a profile photo first before verifying.');
    }

    const currentAvatarPath = path.join(process.cwd(), userRecord.avatarUrl);
    const targetTempPath = path.resolve(tempFilePath);

    if (!fs.existsSync(currentAvatarPath)) {
      throw new Error('Current avatar file does not exist on disk.');
    }

    await this.ensureModelsLoaded();

    const desc1 = await this.getFaceDescriptor(currentAvatarPath);
    if (!desc1) {
      throw new Error('Could not detect face in your current profile picture. Please upload a clearer profile picture.');
    }

    const desc2 = await this.getFaceDescriptor(targetTempPath);
    if (!desc2) {
      throw new Error('Could not detect face in the captured photo. Please align your face in the center.');
    }

    const distance = faceapi.euclideanDistance(desc1, desc2);
    const match = distance < 0.6;

    console.log(`verifyFace -> Distance: ${distance}, Match: ${match}`);
    return {
      match,
      distance,
      message: match ? 'Face verified successfully!' : 'Face verification failed: Photos do not match.'
    };
  }

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
