import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuestionResponse, QuestionResponseDocument } from './QuestionResponse.schema';
import { CreateQuestionResponseDto, UpdateQuestionResponseDto } from './QuestionResponse.dto';
import { QuizService } from '../quiz/Quiz.provider';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../../user/user.provider';

@Injectable()
export class QuestionResponseService {
  constructor(
    @InjectModel(QuestionResponse.name)
    private questionResponseModel: Model<QuestionResponseDocument>,
    private quizService: QuizService,
    private userService: UserService
  ) {}

  async findOne(id: string): Promise<QuestionResponse> {
    return this.questionResponseModel.findById(id).exec();
  }

  async findAll(): Promise<QuestionResponse[]> {
    return this.questionResponseModel.find().exec();
  }

  async create(createQuestionResponseDto: CreateQuestionResponseDto): Promise<QuestionResponse> {
    const createdQuestionResponse = new this.questionResponseModel(createQuestionResponseDto);
    return createdQuestionResponse.save();
  }

  async update(id: string, updateQuestionResponseDto: UpdateQuestionResponseDto): Promise<QuestionResponse> {
    return this.questionResponseModel.findByIdAndUpdate(id, updateQuestionResponseDto, { new: true }).exec();
  }

  async remove(id: string): Promise<QuestionResponse> {
    return this.questionResponseModel.findByIdAndDelete(id).exec();
  }

  async findByUserId(userId: string): Promise<QuestionResponse[]> {
    return this.questionResponseModel.find({ userId }).exec();
  }

  async findByProgramProgressId(programProgressId: string): Promise<QuestionResponse[]> {
    return this.questionResponseModel.find({ programProgressId }).exec();
  }

  async findByQuizId(quizId: string): Promise<QuestionResponse[]> {
    return this.questionResponseModel.find({ quizId }).exec();
  }

  async findByProgramAndQuizId(programProgressId: string, quizId: string): Promise<QuestionResponse[]> {
    return this.questionResponseModel.find({ programProgressId, quizId });
  }

  async submitResponse(
    programProgressId: string,
    userId: string,
    quizId: string,
    submittedAnswer: number
  ): Promise<QuestionResponse> {
    if (await this.questionResponseModel.findOne({ userId, quizId })) {
      await this.questionResponseModel.deleteOne({ userId, quizId });
    }
    const quiz = await this.quizService.findOne(quizId);
    const response = await this.create({
      programProgressId,
      userId,
      quizId,
      submittedAnswer,
      isCorrect: quiz.correctAnswer == submittedAnswer,
      earnedPoints: quiz.correctAnswer == submittedAnswer ? quiz.points : 0,
      answeredAt: new Date()
    });
    if (quiz.correctAnswer == submittedAnswer) {
      console.log('correct!!');
      const user = await this.userService.findOne(userId);
      await this.userService.update(userId, { earnedPoints: user.earnedPoints + quiz.points });
    }
    return response;
  }
}
