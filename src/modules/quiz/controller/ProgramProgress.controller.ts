import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ProgramProgressService } from '../data/programProgress/ProgramProgress.provider';
import { UpdateProgramProgressDto } from '../data/programProgress/ProgramProgress.dto';

@Controller('programProgress')
export class ProgramProgressController {
  constructor(private readonly programProgressService: ProgramProgressService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.programProgressService.findOne(id);
  }

  @Get()
  async findAll() {
    return this.programProgressService.findAll();
  }

  @Get('joinCode/:joinCode')
  async findByJoinCode(@Param('joinCode') joinCode: string) {
    return this.programProgressService.findByJoinCode(joinCode);
  }

  @Get(':id/users')
  async findUsersByProgress(@Param('id') id: string) {
    return this.programProgressService.usersByProgress(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProgramProgressDto: UpdateProgramProgressDto) {
    return this.programProgressService.update(id, updateProgramProgressDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.programProgressService.remove(id);
  }
}
