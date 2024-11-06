import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class CreateQuizProgressDto {
  readonly programProgressId: MongooseSchema.Types.ObjectId;

  readonly currentQuizId: MongooseSchema.Types.ObjectId;

  @IsNumber()
  readonly currentVideoTimestamp: number;

  @IsNumber()
  readonly currentQuestionIndex: number;
}

export class UpdateQuizProgressDto extends PartialType(CreateQuizProgressDto) {}

export class QuizProgressResponseDto extends CreateQuizProgressDto {
  @IsString()
  readonly _id: string;
}
