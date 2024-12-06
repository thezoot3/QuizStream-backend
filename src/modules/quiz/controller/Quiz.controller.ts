import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { QuizService } from '../data/quiz/Quiz.provider';
import { UpdateQuizDto } from '../data/quiz/Quiz.dto';

interface CreateQuizBody {
  displayName: string;
  videoId: string;
  questionTriggerTime: number;
  questionText: string;
  submittingDuration: number;
  videoDuration: number;
  options: string[];
  correctAnswer: number;
  points: number;
  subVideoByOptions: ({ duration: number; videoId: string } | null)[];
}

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.quizService.findOne(id);
  }

  @Get()
  async findAll() {
    return this.quizService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizService.update(id, updateQuizDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.quizService.remove(id);
  }

  @Post()
  async create(@Body() createQuizDto: CreateQuizBody) {
    return this.quizService.create({
      ...createQuizDto,
      options: createQuizDto.options || [],
      correctAnswer: createQuizDto.correctAnswer || 0,
      points: createQuizDto.points || 0,
      subVideoByOptions: createQuizDto.subVideoByOptions || []
    });
  }
}
