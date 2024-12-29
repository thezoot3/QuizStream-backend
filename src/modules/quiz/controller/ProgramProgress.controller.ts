import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
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

  @Post()
  async create(@Body() data: { program: string; joinCode: string }) {
    return this.programProgressService.create({
      users: [],
      currentQuizIndex: 0,
      currentQuiz: '',
      currentSubVideo: 0,
      isStarted: false,
      isEnd: false,
      isSubmittingQuestion: false,
      isOnSubVideo: false,
      currentVideoTimestamp: 0,
      videoPlayerSocketId: '',
      isPaused: false,
      ...data
    });
  }
}
