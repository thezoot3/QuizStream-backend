import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { Quiz, QuizDocument } from '../schemas/Quiz';
import { CreateQuizDto, UpdateQuizDto } from '../dto/Quiz.dto';

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
    return this.quizModel
      .findByIdAndUpdate(id, updateQuizDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Quiz> {
    return this.quizModel.findByIdAndDelete(id).exec();
  }

  async insertQuestion(
    quizId: MongooseSchema.Types.ObjectId,
    questionId: MongooseSchema.Types.ObjectId,
    timestamp: number,
  ): Promise<Quiz> {
    const quiz = await this.quizModel.findById(quizId).exec();
    quiz.questions.set(timestamp, questionId);
    return quiz.save();
  }

  async removeQuestion(
    quizId: MongooseSchema.Types.ObjectId,
    questionId: MongooseSchema.Types.ObjectId,
  ): Promise<Quiz> {
    const quiz = await this.quizModel.findById(quizId).exec();
    quiz.questions.forEach((value, key) => {
      if (value === questionId) {
        quiz.questions.delete(key);
      }
    });
    return quiz.save();
  }
}
