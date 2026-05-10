import { Test, TestingModule } from '@nestjs/testing';
import { LecturerController } from './lecturer.controller';
import { LecturerService } from './lecturer.service';

describe('LecturerController', () => {
  let controller: LecturerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LecturerController],
      providers: [LecturerService],
    }).compile();

    controller = module.get<LecturerController>(LecturerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
