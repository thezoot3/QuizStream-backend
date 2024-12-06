import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async remove(id: MongooseSchema.Types.ObjectId): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async findBySocketId(socketId: string): Promise<User> {
    return this.userModel.findOne({ socketId }).exec();
  }
}
