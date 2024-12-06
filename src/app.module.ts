import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/db/db.module';
import { UserModule } from './modules/user/user.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { QuizClientModule } from './modules/quiz/quizClient/quizClient.module';
import { QuizVideoPlayerModule } from './modules/quiz/quizVideoPlayer/quizVideoPlayer.module';
import { QuizHostModule } from './modules/quiz/quizHost/quizHost.module';

@Module({
  imports: [DatabaseModule, UserModule, QuizModule, QuizClientModule, QuizVideoPlayerModule, QuizHostModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
