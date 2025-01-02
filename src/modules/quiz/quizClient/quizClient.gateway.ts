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
import { UserService } from '../../user/user.provider';
import { ProgramProgressService } from '../data/programProgress/ProgramProgress.provider';
import { QuestionResponseService } from '../data/questionResponse/QuestionResponse.provider';
import { QuizHostService } from '../quizHost/quizHost.provider';
import { QuizService } from '../data/quiz/Quiz.provider';

@WebSocketGateway({
  namespace: 'quizClient',
  cors: true,
  path: '/api/socket.io'
})
export class QuizClientGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly userService: UserService,
    private readonly programProgressService: ProgramProgressService,
    private readonly questionResponseService: QuestionResponseService,
    private readonly quizService: QuizService,
    @Inject(forwardRef(() => QuizHostService)) private readonly quizHostService: QuizHostService
  ) {}
  private logger: Logger = new Logger('ChatGateway');

  afterInit() {
    this.logger.log('WebSocket Initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const user = await this.userService.findBySocketId(client.id);
    if (user) {
      await this.programProgressService.removeJoinedUser(user.joinedProgram, user._id.toString());
      await this.quizHostService.progressUpdateCue(user.joinedProgram);
    }
  }

  @SubscribeMessage('join')
  async handleJoin(client: Socket, payload: { programProgressId: string; nickname: string; userId?: string }) {
    this.logger.log(`Client ${client.id} joined with nickname ${payload.nickname}`);
    if (payload.userId) {
      const exist = await this.userService.findOne(payload.userId);
      await this.userService.update(exist._id.toString(), {
        socketId: client.id,
        earnedPoints: 0,
        joinedProgram: payload.programProgressId
      });
      await this.programProgressService.addJoinedUser(payload.programProgressId, exist._id.toString());
      await this.quizHostService.progressUpdateCue(payload.programProgressId);
      client.join(payload.programProgressId);
      client.join(client.id);
      client.emit('joined', { userId: exist._id.toString() });
      return;
    }
    const user = await this.userService.create({
      socketId: client.id,
      joinedProgram: payload.programProgressId,
      nickname: payload.nickname,
      earnedPoints: 0
    });
    await this.programProgressService.addJoinedUser(payload.programProgressId, user._id.toString());
    client.join(payload.programProgressId);
    client.emit('joined', { userId: user._id.toString() });
    await this.quizHostService.progressUpdateCue(payload.programProgressId);
  }

  @SubscribeMessage('answer')
  async handleAnswer(client: Socket, payload: { quizId: string; answer: number }) {
    const user = await this.userService.findBySocketId(client.id);
    const programPgId = user.joinedProgram;
    const programProgress = await this.programProgressService.findOne(programPgId);
    const quizId = await this.programProgressService.getCurrentQuizId(programPgId);
    if (quizId.toString() === payload.quizId && programProgress.isSubmittingQuestion) {
      console.log(payload.answer);
      await this.questionResponseService.submitResponse(programPgId, user._id.toString(), quizId, payload.answer);
    }
    await this.quizHostService.progressUpdateCue(programPgId);
  }

  async startProgram(programProgressId: string) {
    this.server.to(programProgressId.toString()).emit('startProgram');
  }

  async endProgram(programProgressId: string) {
    this.server.to(programProgressId.toString()).emit('endProgram');
  }

  async endQuestionSubmitting(programProgressId: string) {
    this.server.to(programProgressId).emit('endQuestionSubmitting');
  }

  async sendQuestion(programProgressId: string, quizId: string) {
    this.server.to(programProgressId).emit('cueQuestion', { quizId });
  }

  async broadcastTimeLeft(programProgressId: string, timeLeft: number) {
    this.server.to(programProgressId).emit('broadcastTimeLeft', { timeLeft });
  }

  async quitUser(programProgressId: string, userId: string) {
    const user = await this.userService.findOne(userId);
    this.server.to(user.socketId).emit('quitUser');
  }
}
