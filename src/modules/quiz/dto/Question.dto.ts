import { IsString, IsNumber, IsArray } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateQuestionDto {
  @IsString()
  readonly questionText: string;

  @IsArray()
  readonly options: string[];

  @IsString()
  readonly correctAnswer: string;

  @IsNumber()
  readonly duration: number;

  @IsNumber()
  readonly points: number;
}

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}

export class QuestionResponseDto extends CreateQuestionDto {
  @IsString()
  readonly _id: string;
}
