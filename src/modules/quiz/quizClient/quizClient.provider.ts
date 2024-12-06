import { Injectable } from '@nestjs/common';
import { QuizClientGateway } from './quizClient.gateway';

@Injectable()
export class QuizClientService {
  constructor(private quizClientGateway: QuizClientGateway) {}
  //make method from quizClientGateway to outside
  async startProgram(programProgressId: string) {
    return this.quizClientGateway.startProgram(programProgressId);
  }

  async endProgram(programProgressId: string) {
    return this.quizClientGateway.endProgram(programProgressId);
  }

  async endQuestionSubmitting(programProgressId: string) {
    return this.quizClientGateway.endQuestionSubmitting(programProgressId);
  }

  async sendQuestion(programProgressId: string, question: any) {
    return this.quizClientGateway.sendQuestion(programProgressId, question);
  }

  async broadcastTimeLeft(programProgressId: string, timeLeft: number) {
    return this.quizClientGateway.broadcastTimeLeft(programProgressId, timeLeft);
  }

  async quitUser(programProgressId: string, userId: string) {
    return this.quizClientGateway.quitUser(programProgressId, userId);
  }
}
