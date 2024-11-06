import { IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Schema as MongooseSchema } from 'mongoose';

export class CreateUserDto {
  @IsString()
  readonly nickname: string;

  readonly joinedProgram: MongooseSchema.Types.ObjectId;

  readonly earnedPoints: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UserResponseDto extends CreateUserDto {
  @IsString()
  readonly _id: string;
}
