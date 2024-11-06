import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/User';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from '../dto/User';
import { ProgramProgress } from '../../quiz/schemas/ProgramProgress';
import { QuestionResponseService } from '../../quiz/provider/QuestionResponseService';

export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private questionResponseService: QuestionResponseService,
  ) {}

  async findOne(id: MongooseSchema.Types.ObjectId): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async update(
    id: MongooseSchema.Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: MongooseSchema.Types.ObjectId): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async joinProgram(
    userId: MongooseSchema.Types.ObjectId,
    programProgress: ProgramProgress,
  ): Promise<User> {
    return this.update(userId, { joinedProgram: programProgress._id });
  }

  async leaveProgram(userId: MongooseSchema.Types.ObjectId) {
    await this.remove(userId);
    await this.questionResponseService
      .findByUserId(userId)
      .then((responses) => {
        responses.forEach((response) => {
          this.questionResponseService.remove(response._id);
        });
      });
  }
}
