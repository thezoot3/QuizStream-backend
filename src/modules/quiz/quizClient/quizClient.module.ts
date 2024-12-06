import { forwardRef, Module } from '@nestjs/common';
import { QuizModule } from '../quiz.module';
import { UserModule } from '../../user/user.module';
import { QuizClientService } from './quizClient.provider';
import { QuizHostModule } from '../quizHost/quizHost.module';
import { QuizVideoPlayerModule } from '../quizVideoPlayer/quizVideoPlayer.module';
import { QuizClientGateway } from './quizClient.gateway';

@Module({
  imports: [QuizModule, UserModule, forwardRef(() => QuizHostModule), forwardRef(() => QuizVideoPlayerModule)],
  providers: [QuizClientService, QuizClientGateway],
  exports: [QuizClientService]
})
export class QuizClientModule {}
