import { forwardRef, Module } from '@nestjs/common';
import { QuizModule } from '../quiz.module';
import { UserModule } from '../../user/user.module';
import { QuizVideoPlayerModule } from '../quizVideoPlayer/quizVideoPlayer.module';
import { QuizClientModule } from '../quizClient/quizClient.module';
import { QuizHostService } from './quizHost.provider';
import { QuizHostGateway } from './quizHost.gateway';

@Module({
  imports: [QuizModule, UserModule, forwardRef(() => QuizClientModule), forwardRef(() => QuizVideoPlayerModule)],
  providers: [QuizHostService, QuizHostGateway],
  exports: [QuizHostService]
})
export class QuizHostModule {}
