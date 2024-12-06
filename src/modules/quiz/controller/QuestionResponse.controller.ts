import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { QuestionResponseService } from '../data/questionResponse/QuestionResponse.provider';
import { CreateQuestionResponseDto, UpdateQuestionResponseDto } from '../data/questionResponse/QuestionResponse.dto';

@Controller('questionResponse')
export class QuestionResponseController {
  constructor(private readonly questionResponseService: QuestionResponseService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.questionResponseService.findOne(id);
  }

  @Get()
  async findAll() {
    return this.questionResponseService.findAll();
  }

  @Get('/programProgress/:id')
  async findByProgress(@Param('id') id: string) {
    return this.questionResponseService.findByProgramProgressId(id);
  }

  @Get('/programProgress/:id/quiz/:quizId')
  async findByProgressAndQuiz(@Param('id') id: string, @Param('quizId') quizId: string) {
    return this.questionResponseService.findByProgramAndQuizId(id, quizId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateQuestionResponseDto: UpdateQuestionResponseDto) {
    return this.questionResponseService.update(id, updateQuestionResponseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.questionResponseService.remove(id);
  }

  @Post()
  async create(@Body() createQuestionResponseDto: CreateQuestionResponseDto) {
    return this.questionResponseService.create(createQuestionResponseDto);
  }
}
