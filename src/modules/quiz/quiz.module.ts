import { forwardRef, Module } from '@nestjs/common';
import { ProgramProgressService } from './provider/ProgramProgressService';
import { ProgramService } from './provider/ProgramService';
import { QuizService } from './provider/QuizService';
import { QuestionService } from './provider/QuestionService';
import { QuestionResponseService } from './provider/QuestionResponseService';
import { QuizProgressService } from './provider/QuizProgressService';
import { UserModule } from '../user/user.module';

@Module({
  providers: [
    ProgramService,
    QuizService,
    ProgramProgressService,
    QuestionService,
    QuestionResponseService,
    QuizProgressService,
  ],
  imports: [forwardRef(() => UserModule)],
  exports: [
    ProgramService,
    QuizService,
    ProgramProgressService,
    QuestionService,
    QuestionResponseService,
    QuizProgressService,
  ],
})
export class QuizModule {}
