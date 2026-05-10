import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LecturerService } from './lecturer.service';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';

@Controller('lecturer')
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  @Post()
  create(@Body() createLecturerDto: CreateLecturerDto) {
    return this.lecturerService.create(createLecturerDto);
  }

  @Get()
  findAll() {
    return this.lecturerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lecturerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLecturerDto: UpdateLecturerDto) {
    return this.lecturerService.update(+id, updateLecturerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lecturerService.remove(+id);
  }
}
