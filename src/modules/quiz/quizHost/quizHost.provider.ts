import { Injectable } from '@nestjs/common';
import { QuizHostGateway } from './quizHost.gateway';

@Injectable()
export class QuizHostService {
  constructor(private quizHostGateway: QuizHostGateway) {}

  async progressUpdateCue(programProgressId: string) {
    await this.quizHostGateway.progressUpdateCue(programProgressId);
  }

  //TODO make QuizHostGateway interface to outside
}
