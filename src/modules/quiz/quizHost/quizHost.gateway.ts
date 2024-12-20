import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { QuizService } from '../data/quiz/Quiz.provider';
import { ProgramProgressService } from '../data/programProgress/ProgramProgress.provider';
import { QuizVideoPlayerService } from '../quizVideoPlayer/quizVideoPlayer.provider';
import { QuizClientService } from '../quizClient/quizClient.provider';
import { QuestionResponseService } from '../data/questionResponse/QuestionResponse.provider';

@WebSocketGateway({
  namespace: 'quizHost',
  cors: true,
  path: '/api/socket.io'
})
export class QuizHostGateway {
  @WebSocketServer()
  server: Server;
  constructor(
    private quizService: QuizService,
    private programProgressService: ProgramProgressService,
    private quizVideoPlayerService: QuizVideoPlayerService,
    private quizResponseService: QuestionResponseService,
    @Inject(forwardRef(() => QuizClientService)) private quizClientService: QuizClientService
  ) {}
  private logger: Logger = new Logger('QuizHostGateway');

  afterInit() {
    this.logger.log('WebSocket Initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  async handleJoin(client: Socket, payload: { programProgressId: string }) {
    client.join(payload.programProgressId);
    client.emit('joined');
  }

  @SubscribeMessage('startProgram')
  async handleStartProgram(client: Socket, payload: { programProgressId: string }) {
    const progress = await this.programProgressService.findOne(payload.programProgressId);
    if (progress.isStarted) {
      return;
    }
    const newProgress = await this.programProgressService.update(progress._id.toString(), {
      isStarted: true,
      currentVideoTimestamp: 0,
      isEnd: false,
      isSubmittingQuestion: false,
      currentSubVideo: undefined,
      currentQuizIndex: 0,
      isOnSubVideo: false
    });
    for (const a of await this.quizResponseService.findByProgramProgressId(payload.programProgressId)) {
      await this.quizResponseService.remove(a._id.toString());
    }
    await this.programProgressService.setQuizByIndex(progress._id.toString(), 0);
    await this.quizVideoPlayerService.startVideo(progress._id.toString());
    await this.quizClientService.startProgram(progress._id.toString());
    client.emit('programStarted');
  }

  @SubscribeMessage('endProgram')
  async handleEndProgram(client: Socket, payload: { programProgressId: string }) {
    const progressId = payload.programProgressId;
    await this.programProgressService.update(progressId, { isEnd: true });
    await this.quizClientService.endProgram(progressId.toString());
    await this.quizVideoPlayerService.endProgram(progressId.toString());
    client.emit('programEnded');
  }

  @SubscribeMessage('setQuiz')
  async handleSetQuiz(client: Socket, payload: { programProgressId: string; quizIndex: number }) {
    const progressId = payload.programProgressId;
    await this.quizVideoPlayerService.setQuiz(progressId.toString(), payload.quizIndex);
    await this.quizClientService.endQuestionSubmitting(progressId.toString());
  }

  @SubscribeMessage('setTimestamp')
  async setTimestamp(client: Socket, payload: { programProgressId: string; timestamp: number }) {
    await this.quizVideoPlayerService.setTimestamp(payload.programProgressId, payload.timestamp);
  }

  @SubscribeMessage('quitUser')
  async handleQuitUser(client: Socket, payload: { programProgressId: string; userId: string }) {
    await this.programProgressService.removeJoinedUser(payload.programProgressId, payload.userId);
    await this.quizClientService.quitUser(payload.programProgressId, payload.userId);
    await this.userUpdateCue(payload.programProgressId);
  }

  async progressUpdateCue(programProgressId: string) {
    return this.server.to(programProgressId).emit('progressUpdateCue');
  }

  async responseUpdateCue(programProgressId: string) {
    return this.server.to(programProgressId).emit('responseUpdateCue');
  }

  async userUpdateCue(programProgressId: string) {
    return this.server.to(programProgressId).emit('userUpdateCue');
  }
}
