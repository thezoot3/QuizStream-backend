import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Program, ProgramDocument } from './Program.schema';
import { CreateProgramDto, UpdateProgramDto } from './Program.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProgramService {
  constructor(
    @InjectModel(Program.name)
    private programModel: Model<ProgramDocument>
  ) {}

  async findOne(id: string): Promise<Program> {
    return this.programModel.findById(id).exec();
  }

  async findAll(): Promise<Program[]> {
    return this.programModel.find().exec();
  }

  async create(createProgramDto: CreateProgramDto): Promise<Program> {
    const createdProgram = new this.programModel(createProgramDto);
    return createdProgram.save();
  }

  async update(id: string, updateProgramDto: UpdateProgramDto): Promise<Program> {
    return this.programModel.findByIdAndUpdate(id, updateProgramDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Program> {
    return this.programModel.findByIdAndDelete(id).exec();
  }

  async addQuiz(programId: string, quizId: string): Promise<Program> {
    const program = await this.programModel.findById(programId).exec();
    const newQuizList = program.quizList;
    newQuizList.push(quizId);
    return this.programModel.findByIdAndUpdate(programId, { quizList: newQuizList }).exec();
  }

  async removeQuiz(programId: string, quizId: string): Promise<Program> {
    const program = await this.programModel.findById(programId).exec();
    const newQuizMap = program.quizList.filter((id) => id !== quizId);
    return this.programModel.findByIdAndUpdate(programId, { quizList: newQuizMap }).exec();
  }

  async setQuizIndex(programId: string, quizId: string, index: number): Promise<Program> {
    const program = await this.programModel.findById(programId).exec();
    const quizIndex = program.quizList.findIndex((id) => id === quizId);
    program.quizList.splice(quizIndex, 1);
    program.quizList.splice(index, 0, quizId);
    return program.save();
  }
}
