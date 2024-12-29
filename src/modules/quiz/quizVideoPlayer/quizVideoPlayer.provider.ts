import { Injectable } from '@nestjs/common';
import { QuizVideoPlayerGateway } from './quizVideoPlayer.gateway';
import { QuizService } from '../data/quiz/Quiz.provider';
import { ProgramProgressService } from '../data/programProgress/ProgramProgress.provider';
import { QuestionResponseService } from '../data/questionResponse/QuestionResponse.provider';

@Injectable()
export class QuizVideoPlayerService {
  constructor(
    private quizVideoPlayerGateway: QuizVideoPlayerGateway,
    private quizService: QuizService,
    private programProgressService: ProgramProgressService,
    private quizResponseService: QuestionResponseService
  ) {}
  async setQuiz(programProgressId: string, quizIndex: number) {
    const progress = await this.programProgressService.findOne(programProgressId);
    if (progress && progress.isStarted && !progress.isEnd) {
      const newProgress = await this.programProgressService.setQuizByIndex(programProgressId, quizIndex);
      const quiz = await this.quizService.findOne(newProgress.currentQuiz);
      await this.quizVideoPlayerGateway.startVideo(programProgressId, quiz.videoId);
      await this.programProgressService.update(programProgressId, {
        isSubmittingQuestion: false,
        currentSubVideo: undefined
      });
      (await this.quizResponseService.findByProgramAndQuizId(programProgressId, progress.currentQuiz)).forEach((i) => {
        this.quizResponseService.remove(i._id.toString());
      });
    }
  }
  async startVideo(programProgressId: string) {
    const progress = await this.programProgressService.findOne(programProgressId);
    const quiz = await this.quizService.findOne(progress.currentQuiz);
    await this.quizVideoPlayerGateway.startVideo(programProgressId, quiz.videoId);
  }
  async setTimestamp(programProgressId: string, timestamp: number) {
    await this.quizVideoPlayerGateway.setVideoTimestamp(programProgressId, timestamp);
  }

  async endProgram(programProgressId: string) {
    await this.programProgressService.update(programProgressId, { isEnd: true });
    await this.quizVideoPlayerGateway.endProgram(programProgressId);
  }

  async pauseVideo(programProgressId: string) {
    const progress = await this.programProgressService.findOne(programProgressId);
    this.quizVideoPlayerGateway.server.emit(progress.videoPlayerSocketId, 'pause');
  }

  async unpauseVideo(programProgressId: string) {
    const progress = await this.programProgressService.findOne(programProgressId);
    this.quizVideoPlayerGateway.server.emit(progress.videoPlayerSocketId, 'unpause');
  }
  //TODO make QuizVideoPlayerGateway interface to outside
}
