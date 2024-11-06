import { PartialType } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNumber, IsDate } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class CreateQuestionResponseDto {
  readonly programProgressId: MongooseSchema.Types.ObjectId;

  readonly userId: MongooseSchema.Types.ObjectId;

  readonly quizId: MongooseSchema.Types.ObjectId;

  readonly questionId: MongooseSchema.Types.ObjectId;

  @IsString()
  readonly submittedAnswer: string;

  @IsBoolean()
  readonly isCorrect: boolean;

  @IsNumber()
  readonly earnedPoints: number;

  @IsDate()
  readonly answeredAt: Date;
}

export class UpdateQuestionResponseDto extends PartialType(
  CreateQuestionResponseDto,
) {}

export class QuestionResponseResponseDto extends CreateQuestionResponseDto {
  @IsString()
  readonly _id: string;
}
