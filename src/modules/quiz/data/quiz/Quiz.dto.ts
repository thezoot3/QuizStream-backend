import { IsArray, IsNumber, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateQuizDto {
  @IsString()
  readonly displayName: string;

  @IsString()
  readonly videoId: string;

  @IsNumber()
  readonly questionTriggerTime: number;

  @IsNumber()
  videoDuration: number;

  @IsString()
  questionText: string;

  @IsArray()
  options: string[];

  @IsNumber()
  correctAnswer: number;

  @IsNumber()
  submittingDuration: number;

  @IsNumber()
  points: number;

  @IsArray()
  subVideoByOptions: ({ duration: number; videoId: string } | null)[];
}

export class UpdateQuizDto extends PartialType(CreateQuizDto) {}

export class QuizResponseDto extends CreateQuizDto {
  @IsString()
  readonly _id: string;
}
