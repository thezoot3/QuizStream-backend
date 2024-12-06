import { forwardRef, Module } from '@nestjs/common';
import { Program, ProgramSchema } from './data/program/Program.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from './data/quiz/Quiz.schema';
import { QuestionResponse, QuestionResponseSchema } from './data/questionResponse/QuestionResponse.schema';
import { ProgramProgress, ProgramProgressSchema } from './data/programProgress/ProgramProgress.schema';
import { UserModule } from '../user/user.module';
import { QuestionResponseService } from './data/questionResponse/QuestionResponse.provider';
import { ProgramService } from './data/program/Program.provider';
import { ProgramProgressService } from './data/programProgress/ProgramProgress.provider';
import { QuizService } from './data/quiz/Quiz.provider';
import { QuestionResponseController } from './controller/QuestionResponse.controller';
import { ProgramProgressController } from './controller/ProgramProgress.controller';
import { QuizController } from './controller/Quiz.controller';
import { ProgramController } from './controller/Program.controller';

@Module({
  controllers: [QuizController, ProgramController, ProgramProgressController, QuestionResponseController],
  providers: [ProgramService, ProgramProgressService, QuizService, QuestionResponseService],
  imports: [
    MongooseModule.forFeature([
      { name: Program.name, schema: ProgramSchema },
      { name: ProgramProgress.name, schema: ProgramProgressSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: QuestionResponse.name, schema: QuestionResponseSchema }
    ]),
    forwardRef(() => UserModule)
  ],
  exports: [ProgramService, ProgramProgressService, QuizService, QuestionResponseService]
})
export class QuizModule {}
