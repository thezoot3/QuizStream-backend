import { IsString } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';
import { PartialType } from '@nestjs/swagger';

export class CreateQuizDto {
  @IsString()
  readonly displayName: string;

  @IsString()
  readonly videoId: string;

  readonly questions: Map<number, MongooseSchema.Types.ObjectId>;
}

export class UpdateQuizDto extends PartialType(CreateQuizDto) {}

export class QuizResponseDto extends CreateQuizDto {
  @IsString()
  readonly _id: string;
}
