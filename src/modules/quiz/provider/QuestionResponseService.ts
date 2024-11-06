import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import {
  QuestionResponse,
  QuestionResponseDocument,
} from '../schemas/QuestionResponse';
import {
  CreateQuestionResponseDto,
  UpdateQuestionResponseDto,
} from '../dto/QuestionResponse.dto';

export class QuestionResponseService {
  constructor(
    @InjectModel(QuestionResponse.name)
    private questionResponseModel: Model<QuestionResponseDocument>,
  ) {}

  async findOne(id: string): Promise<QuestionResponse> {
    return this.questionResponseModel.findById(id).exec();
  }

  async findAll(): Promise<QuestionResponse[]> {
    return this.questionResponseModel.find().exec();
  }

  async create(
    createQuestionResponseDto: CreateQuestionResponseDto,
  ): Promise<QuestionResponse> {
    const createdQuestionResponse = new this.questionResponseModel(
      createQuestionResponseDto,
    );
    return createdQuestionResponse.save();
  }

  async update(
    id: string,
    updateQuestionResponseDto: UpdateQuestionResponseDto,
  ): Promise<QuestionResponse> {
    return this.questionResponseModel
      .findByIdAndUpdate(id, updateQuestionResponseDto, { new: true })
      .exec();
  }

  async remove(id: MongooseSchema.Types.ObjectId): Promise<QuestionResponse> {
    return this.questionResponseModel.findByIdAndDelete(id).exec();
  }

  async findByUserId(
    userId: MongooseSchema.Types.ObjectId,
  ): Promise<QuestionResponse[]> {
    return this.questionResponseModel.find({ userId }).exec();
  }

  async findByProgramProgressId(
    programProgressId: MongooseSchema.Types.ObjectId,
  ): Promise<QuestionResponse[]> {
    return this.questionResponseModel.find({ programProgressId }).exec();
  }

  async findByQuizId(
    quizId: MongooseSchema.Types.ObjectId,
  ): Promise<QuestionResponse[]> {
    return this.questionResponseModel.find({ quizId }).exec();
  }

  async findByQuestionId(
    questionId: MongooseSchema.Types.ObjectId,
  ): Promise<QuestionResponse[]> {
    return this.questionResponseModel.find({ questionId }).exec();
  }

  //async submitAnswer(userId: MongooseSchema.Types.ObjectId, answer: string) {}
}
