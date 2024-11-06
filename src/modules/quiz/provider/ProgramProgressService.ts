import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProgramProgress,
  ProgramProgressDocument,
} from '../schemas/ProgramProgress';
import {
  CreateProgramProgressDto,
  UpdateProgramProgressDto,
} from '../dto/ProgramProgress.dto';

export class ProgramProgressService {
  constructor(
    @InjectModel(ProgramProgress.name)
    private programProgressModel: Model<ProgramProgressDocument>,
  ) {}

  async findOne(id: string): Promise<ProgramProgress> {
    return this.programProgressModel.findById(id).exec();
  }

  async findAll(): Promise<ProgramProgress[]> {
    return this.programProgressModel.find().exec();
  }

  async create(
    createProgramProgressDto: CreateProgramProgressDto,
  ): Promise<ProgramProgress> {
    const createdProgramProgress = new this.programProgressModel(
      createProgramProgressDto,
    );
    return createdProgramProgress.save();
  }

  async update(
    id: string,
    updateProgramProgressDto: UpdateProgramProgressDto,
  ): Promise<ProgramProgress> {
    return this.programProgressModel
      .findByIdAndUpdate(id, updateProgramProgressDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<ProgramProgress> {
    return this.programProgressModel.findByIdAndDelete(id).exec();
  }
}
