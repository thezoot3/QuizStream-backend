import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProgramService } from '../data/program/Program.provider';
import { UpdateProgramDto } from '../data/program/Program.dto';

interface CreateProgramBody {
  programName: string;
}

@Controller('program')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.programService.findOne(id);
  }

  @Get()
  async findAll() {
    return this.programService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProgramDto: UpdateProgramDto) {
    return this.programService.update(id, updateProgramDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.programService.remove(id);
  }

  @Post()
  async create(@Body() createProgramDto: CreateProgramBody) {
    return this.programService.create({ ...createProgramDto, quizList: [] });
  }
}
