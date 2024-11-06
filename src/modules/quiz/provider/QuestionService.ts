import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from '../schemas/Question';
import { CreateQuestionDto, UpdateQuestionDto } from '../dto/Question.dto';

export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async findOne(id: string): Promise<Question> {
    return this.questionModel.findById(id).exec();
  }

  async findAll(): Promise<Question[]> {
    return this.questionModel.find().exec();
  }

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const createdQuestion = new this.questionModel(createQuestionDto);
    return createdQuestion.save();
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    return this.questionModel
      .findByIdAndUpdate(id, updateQuestionDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Question> {
    return this.questionModel.findByIdAndDelete(id).exec();
  }
}
