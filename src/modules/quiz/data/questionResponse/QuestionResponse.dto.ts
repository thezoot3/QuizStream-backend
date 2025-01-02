import { PartialType } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateQuestionResponseDto {
  @IsString()
  readonly programProgressId: string;

  @IsString()
  readonly userId: string;

  @IsString()
  readonly quizId: string;

  @IsString()
  readonly submittedAnswer: string;

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
