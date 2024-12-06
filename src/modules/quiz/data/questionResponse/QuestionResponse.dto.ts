import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class CreateQuestionResponseDto {
  @IsString()
  readonly programProgressId: string;

  @IsString()
  readonly userId: string;

  @IsString()
  readonly quizId: string;

  @IsNumber()
  readonly submittedAnswer: number;

  @IsBoolean()
  readonly isCorrect: boolean;

  @IsNumber()
  readonly earnedPoints: number;

  @IsDate()
  readonly answeredAt: Date;
}

export class UpdateQuestionResponseDto extends PartialType(CreateQuestionResponseDto) {}

export class QuestionResponseResponseDto extends CreateQuestionResponseDto {
  @IsString()
  readonly _id: string;
}
