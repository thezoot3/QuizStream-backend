import { IsString, IsArray } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';
import { PartialType } from '@nestjs/swagger';

export class CreateProgramDto {
  @IsString()
  readonly programName: string;

  @IsArray()
  readonly quizList: MongooseSchema.Types.ObjectId[];
}

export class UpdateProgramDto extends PartialType(CreateProgramDto) {}

export class ProgramResponseDto extends CreateProgramDto {
  @IsString()
  readonly _id: string;
}
