import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz, QuizDocument } from './Quiz.schema';
import { CreateQuizDto, UpdateQuizDto } from './Quiz.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizService {
  constructor(@InjectModel(Quiz.name) private quizModel: Model<QuizDocument>) {}

  async findOne(id: string): Promise<Quiz> {
    return this.quizModel.findById(id).exec();
  }

  async findAll(): Promise<Quiz[]> {
    return this.quizModel.find().exec();
  }

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const createdQuiz = new this.quizModel(createQuizDto);
    return createdQuiz.save();
  }

  async update(id: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    return this.quizModel.findByIdAndUpdate(id, updateQuizDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Quiz> {
    return this.quizModel.findByIdAndDelete(id).exec();
  }
}
