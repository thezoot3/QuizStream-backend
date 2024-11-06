import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuizProgress, QuizProgressDocument } from '../schemas/QuizProgress';
import {
  CreateQuizProgressDto,
  UpdateQuizProgressDto,
} from '../dto/QuizProgress.dto';

export class QuizProgressService {
  constructor(
    @InjectModel(QuizProgress.name)
    private quizProgressModel: Model<QuizProgressDocument>,
  ) {}

  async findOne(id: string): Promise<QuizProgress> {
    return this.quizProgressModel.findById(id).exec();
  }

  async findAll(): Promise<QuizProgress[]> {
    return this.quizProgressModel.find().exec();
  }

  async create(
    createQuizProgressDto: CreateQuizProgressDto,
  ): Promise<QuizProgress> {
    const createdQuizProgress = new this.quizProgressModel(
      createQuizProgressDto,
    );
    return createdQuizProgress.save();
  }

  async update(
    id: string,
    updateQuizProgressDto: UpdateQuizProgressDto,
  ): Promise<QuizProgress> {
    return this.quizProgressModel
      .findByIdAndUpdate(id, updateQuizProgressDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<QuizProgress> {
    return this.quizProgressModel.findByIdAndDelete(id).exec();
  }
}
