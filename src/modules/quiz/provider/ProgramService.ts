import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { Program, ProgramDocument } from '../schemas/Program';
import { CreateProgramDto, UpdateProgramDto } from '../dto/Program.dto';

export class ProgramService {
  constructor(
    @InjectModel(Program.name) private programModel: Model<ProgramDocument>,
  ) {}

  async findOne(id: MongooseSchema.Types.ObjectId): Promise<Program> {
    return this.programModel.findById(id).exec();
  }

  async findAll(): Promise<Program[]> {
    return this.programModel.find().exec();
  }

  async create(createProgramDto: CreateProgramDto): Promise<Program> {
    const createdProgram = new this.programModel(createProgramDto);
    return createdProgram.save();
  }

  async update(
    id: MongooseSchema.Types.ObjectId,
    updateProgramDto: UpdateProgramDto,
  ): Promise<Program> {
    return this.programModel
      .findByIdAndUpdate(id, updateProgramDto, { new: true })
      .exec();
  }

  async remove(id: MongooseSchema.Types.ObjectId): Promise<Program> {
    return this.programModel.findByIdAndDelete(id).exec();
  }

  async addQuiz(
    programId: MongooseSchema.Types.ObjectId,
    quizId: MongooseSchema.Types.ObjectId,
  ): Promise<Program> {
    const program = await this.programModel.findById(programId).exec();
    program.quizList.push(quizId);
    return program.save();
  }

  async removeQuiz(
    programId: MongooseSchema.Types.ObjectId,
    quizId: MongooseSchema.Types.ObjectId,
  ): Promise<Program> {
    const program = await this.programModel.findById(programId).exec();
    program.quizList = program.quizList.filter((id) => id !== quizId);
    return program.save();
  }

  async setQuizIndex(
    programId: MongooseSchema.Types.ObjectId,
    quizId: MongooseSchema.Types.ObjectId,
    index: number,
  ): Promise<Program> {
    const program = await this.programModel.findById(programId).exec();
    const quizIndex = program.quizList.findIndex((id) => id === quizId);
    program.quizList.splice(quizIndex, 1);
    program.quizList.splice(index, 0, quizId);
    return program.save();
  }
}
