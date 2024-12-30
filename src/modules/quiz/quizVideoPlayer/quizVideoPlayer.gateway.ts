import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { ProgramProgressService } from '../data/programProgress/ProgramProgress.provider';
import { QuizService } from '../data/quiz/Quiz.provider';
import { ProgramService } from '../data/program/Program.provider';
import { QuestionResponseService } from '../data/questionResponse/QuestionResponse.provider';
import { QuizClientService } from '../quizClient/quizClient.provider';
import { QuizHostService } from '../quizHost/quizHost.provider';

@WebSocketGateway({
  namespace: 'quizVideoPlayer',
  cors: true,
  path: '/api/socket.io'
})
export class QuizVideoPlayerGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('QuizVideoPlayerGateway');

  constructor(
    private readonly programProgressService: ProgramProgressService,
    @Inject(forwardRef(() => QuizClientService)) private readonly quizClientService: QuizClientService,
    private readonly questionResponseService: QuestionResponseService,
    private readonly quizService: QuizService,
    private readonly programService: ProgramService,
    @Inject(forwardRef(() => QuizHostService)) private readonly quizHostService: QuizHostService
  ) {}
  afterInit() {
    this.logger.log('WebSocket Initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    await this.setVideoPlayerSocketId(null, client.id);
  }

  @SubscribeMessage('join')
  async handleJoin(client: Socket, payload: { programProgressId: string }) {
    await this.setVideoPlayerSocketId(payload.programProgressId, client.id);
    client.join(client.id);
    client.emit('joined');
    const progress = await this.programProgressService.findOne(payload.programProgressId);
    console.log(progress);
    if (progress.isStarted && !progress.isEnd) {
      const quiz = await this.quizService.findOne(progress.currentQuiz.toString());
      await this.startVideo(payload.programProgressId, quiz.videoId);
    }
  }

  @SubscribeMessage('videoTimestamp')
  async handleVideoTimestamp(client: Socket, payload: { programProgressId: string; timestamp: number }) {
    const progress = await this.programProgressService.update(payload.programProgressId, {
      currentVideoTimestamp: payload.timestamp
    });
    const quizId = await this.programProgressService.getCurrentQuizId(progress._id.toString());
    const quiz = await this.quizService.findOne(quizId);
    /*
    //preload next video
    if (quiz.subVideoByOptions && quiz.subVideoByOptions.some((i) => i)) {
      //check there is a sub video
      if (quiz.subVideoByOptions[progress.currentSubVideo].duration - payload.timestamp < 3) {
        if (progress.currentSubVideo + 1 < quiz.subVideoByOptions.length) {
          //send next Sub Video Preload
          client.emit('preloadNextVideo', { videoId: quiz.subVideoByOptions[progress.currentSubVideo + 1].videoId });
        } else {
          //send next Quiz Main Video Preload
          const program = await this.programService.findOne(progress.program);
          if (progress.currentQuizIndex + 1 < program.quizList.length) {
            const nextQuiz = await this.quizService.findOne(program.quizList[progress.currentQuizIndex + 1]);
            client.emit('preloadNextVideo', { videoId: nextQuiz.videoId });
          }
        }
      }
    }
    if (quiz.videoDuration - payload.timestamp < 3) {
      //no subvideo
      const program = await this.programService.findOne(progress.program);
      if (progress.currentQuizIndex + 1 < program.quizList.length) {
        const nextQuiz = await this.quizService.findOne(program.quizList[progress.currentQuizIndex + 1]);
        client.emit('preloadNextVideo', { videoId: nextQuiz.videoId });
      }
    }
    */
    console.log(progress.isSubmittingQuestion, quiz.questionTriggerTime, payload.timestamp);
    if (progress.isSubmittingQuestion) {
      //start and stop submitting question
      const remaining = quiz.questionTriggerTime + quiz.submittingDuration - payload.timestamp;
      await this.quizClientService.broadcastTimeLeft(payload.programProgressId, remaining);
      if (remaining <= 0) {
        await this.programProgressService.update(progress._id.toString(), {
          isSubmittingQuestion: false
        });
        await this.quizClientService.endQuestionSubmitting(progress._id.toString());
      }
    } else if (
      quiz.questionTriggerTime <= payload.timestamp &&
      quiz.questionTriggerTime + quiz.submittingDuration > payload.timestamp &&
      !progress.isOnSubVideo
    ) {
      await this.programProgressService.update(progress._id.toString(), { isSubmittingQuestion: true });
      await this.quizClientService.sendQuestion(progress._id.toString(), progress.currentQuiz.toString());
    }
    await this.quizHostService.progressUpdateCue(progress._id.toString());
  }

  @SubscribeMessage('videoEnd')
  async handleVideoEnd(client: Socket, payload: { programProgressId: string }) {
    const progressId = payload.programProgressId;
    const progress = await this.programProgressService.findOne(progressId);
    const program = await this.programService.findOne(progress.program);
    const quiz = await this.quizService.findOne(progress.currentQuiz.toString());
    if (quiz?.subVideoByOptions && quiz.subVideoByOptions.filter((item) => item !== null).length > 0) {
      const questionResponses = (await this.questionResponseService.findByQuizId(quiz._id.toString())).filter(
        (i) => i.programProgressId === progressId
      );
      const countByAnswer = new Array(quiz.options.length).fill(0).map((_, i) => {
        return questionResponses.filter((j) => j.submittedAnswer === i).length;
      });
      const sortedAnswers = countByAnswer.map((_, i) => i).sort((a, b) => countByAnswer[b] - countByAnswer[a]);
      if (progress.isOnSubVideo && progress.currentSubVideo + 1 < quiz.subVideoByOptions.length) {
        const subVideo = quiz.subVideoByOptions[sortedAnswers[progress.currentSubVideo + 1]];
        await this.startVideo(payload.programProgressId, subVideo.videoId);
        await this.programProgressService.update(progress._id.toString(), {
          currentSubVideo: progress.currentSubVideo + 1
        });
        await this.quizHostService.progressUpdateCue(progress._id.toString());
        return;
      } else if (!progress.isOnSubVideo) {
        await this.startVideo(payload.programProgressId, quiz.subVideoByOptions[sortedAnswers[0]].videoId);
        await this.programProgressService.update(progress._id.toString(), { currentSubVideo: 0, isOnSubVideo: true });
        await this.quizHostService.progressUpdateCue(progress._id.toString());
        return;
      }
    }
    if (progress.currentQuizIndex + 1 >= program.quizList.length) {
      client.emit('programEnd');
      await this.programProgressService.update(progressId, { isEnd: true, isSubmittingQuestion: false });
      await this.quizClientService.endProgram(progressId.toString());
      await this.quizHostService.progressUpdateCue(progress._id.toString());
      return;
    }
    const newQuiz = await this.quizService.findOne(program.quizList[progress.currentQuizIndex + 1]);
    await this.startVideo(payload.programProgressId, newQuiz.videoId);
    await this.programProgressService.update(progressId, {
      currentSubVideo: 0,
      isOnSubVideo: false,
      isSubmittingQuestion: false,
      currentVideoTimestamp: 0
    });
    await this.programProgressService.setQuizByIndex(progressId, progress.currentQuizIndex + 1);
    await this.quizHostService.progressUpdateCue(progress._id.toString());
  }

  async startVideo(programProgressId: string, videoId: string) {
    const videoPlayerSocketId = await this.getVideoPlayerSocketId(programProgressId);
    this.server.to(videoPlayerSocketId).emit('startVideo', { videoId });
  }

  async setVideoTimestamp(programProgressId: string, timestamp: number) {
    const videoPlayerSocketId = await this.getVideoPlayerSocketId(programProgressId);
    this.server.to(videoPlayerSocketId).emit('setVideoTimestamp', { timestamp });
  }

  async getVideoPlayerSocketId(programProgressId: string) {
    const progress = await this.programProgressService.findOne(programProgressId);
    if (progress === null) {
      throw new Error();
    }
    return progress.videoPlayerSocketId;
  }

  async setVideoPlayerSocketId(programProgressId: string, socketId: string) {
    return this.programProgressService.setVideoPlayerSocketId(programProgressId, socketId);
  }

  async endProgram(programProgressId: string) {
    const videoPlayerSocketId = await this.getVideoPlayerSocketId(programProgressId);
    this.server.to(videoPlayerSocketId).emit('endProgram');
  }
}
