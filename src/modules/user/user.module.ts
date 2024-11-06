import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './provider/UserService';
import { QuizModule } from '../quiz/quiz.module';

@Module({
  providers: [UserService],
  imports: [forwardRef(() => QuizModule)],
  exports: [UserService],
})
export class UserModule {}
