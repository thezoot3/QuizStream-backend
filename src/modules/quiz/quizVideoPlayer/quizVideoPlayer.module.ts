import { UserModule } from '../../user/user.module';
import { QuizModule } from '../quiz.module';
import { forwardRef, Module } from '@nestjs/common';
import { QuizClientModule } from '../quizClient/quizClient.module';
import { QuizHostModule } from '../quizHost/quizHost.module';
import { QuizVideoPlayerService } from './quizVideoPlayer.provider';
import { QuizVideoPlayerGateway } from './quizVideoPlayer.gateway';

@Module({
  imports: [QuizModule, UserModule, forwardRef(() => QuizClientModule), forwardRef(() => QuizHostModule)],
  providers: [QuizVideoPlayerService, QuizVideoPlayerGateway],
  exports: [QuizVideoPlayerService]
})
export class QuizVideoPlayerModule {}
