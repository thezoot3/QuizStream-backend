import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProgramProgress, ProgramProgressDocument } from './ProgramProgress.schema';
import { CreateProgramProgressDto, UpdateProgramProgressDto } from './ProgramProgress.dto';
import { ProgramService } from '../program/Program.provider';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../../user/user.provider';
import { User } from '../../../user/user.schema';

@Injectable()
export class ProgramProgressService {
  constructor(
    @InjectModel(ProgramProgress.name)
    private programProgressModel: Model<ProgramProgressDocument>,
    private programService: ProgramService,
    private userService: UserService
  ) {}

  async findOne(id: string): Promise<ProgramProgress> {
    return this.programProgressModel.findById(id).exec();
  }

  async findAll(): Promise<ProgramProgress[]> {
    return this.programProgressModel.find().exec();
  }

  async findByJoinCode(joinCode: string): Promise<ProgramProgress> {
    return this.programProgressModel.findOne({ joinCode }).exec();
  }

  async usersByProgress(id: string): Promise<User[]> {
    const progress = await this.programProgressModel.findById(id);
    return await Promise.all(
      progress.users.map(async (i) => {
        return await this.userService.findOne(i);
      })
    );
  }

  async create(createProgramProgressDto: CreateProgramProgressDto): Promise<ProgramProgress> {
    const createdProgramProgress = new this.programProgressModel(createProgramProgressDto);
    return createdProgramProgress.save();
  }

  async update(id: string, updateProgramProgressDto: UpdateProgramProgressDto): Promise<ProgramProgress> {
    return this.programProgressModel.findByIdAndUpdate(id, updateProgramProgressDto, { new: true }).exec();
  }

  async remove(id: string): Promise<ProgramProgress> {
    return this.programProgressModel.findByIdAndDelete(id).exec();
  }

  private async getQuizIdByIndex(id: string, index: number): Promise<string> {
    const programProgress = await this.programProgressModel.findById(id);
    const program = await this.programService.findOne(programProgress.program);
    return program.quizList[index];
  }

  async setVideoPlayerSocketId(id: string, socketId: string): Promise<ProgramProgress> {
    return await this.update(id, { videoPlayerSocketId: socketId });
  }

  async getCurrentQuizId(id: string): Promise<string> {
    const programProgress = await this.programProgressModel.findById(id).exec();
    return programProgress.currentQuiz;
  }

  async setQuizByIndex(id: string, index: number): Promise<ProgramProgress> {
    const programProgress = await this.programProgressModel.findById(id).exec();
    const program = await this.programService.findOne(programProgress.program);
    return await this.update(id, {
      currentQuiz: program.quizList[index],
      currentQuizIndex: index
    });
  }

  async addJoinedUser(programProgressId: string, userId: string) {
    const programProgress = await this.programProgressModel.findById(programProgressId).exec();
    const newJoinedUsers = programProgress.users;
    if (newJoinedUsers.includes(userId) || programProgress.isEnd) {
      return;
    }
    newJoinedUsers.push(userId);
    await this.update(programProgressId, { users: newJoinedUsers });
  }

  async removeJoinedUser(programProgressId: string, userId: string) {
    const programProgress = await this.programProgressModel.findById(programProgressId).exec();
    if (programProgress.isEnd && programProgress.isStarted) {
      return;
    }
    const newJoinedUsers = programProgress.users.filter((i) => i !== userId);
    await this.update(programProgressId, { users: newJoinedUsers });
  }
}
