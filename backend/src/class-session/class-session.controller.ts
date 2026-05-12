import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ClassSessionService } from './class-session.service';
import { CreateClassSessionDto } from './dto/create-class-session.dto';
import { UpdateClassSessionDto } from './dto/update-class-session.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('class-session')
export class ClassSessionController {
  constructor(private readonly classSessionService: ClassSessionService) {}

  @Post()
  create(@Body() createClassSessionDto: CreateClassSessionDto) {
    return this.classSessionService.create(createClassSessionDto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.classSessionService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classSessionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassSessionDto: UpdateClassSessionDto) {
    return this.classSessionService.update(+id, updateClassSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classSessionService.remove(+id);
  }
}
