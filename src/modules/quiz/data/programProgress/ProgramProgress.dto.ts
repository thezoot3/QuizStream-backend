import { PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateProgramProgressDto {
  @IsString()
  program: string;

  @IsNumber()
  currentQuizIndex: number;

  @IsString()
  currentQuiz?: string;

  @IsString({ each: true })
  users: string[];

  @IsNumber()
  currentVideoTimestamp?: number;

  @IsBoolean()
  isSubmittingQuestion: boolean;

  @IsString()
  videoPlayerSocketId?: string;

  @IsBoolean()
  isStarted: boolean;

  @IsBoolean()
  isEnd: boolean;

  @IsArray()
  currentSubVideo?: number;

  @IsBoolean()
  isOnSubVideo: boolean;

  @IsBoolean()
  isPaused: boolean;
}

export class UpdateProgramProgressDto extends PartialType(CreateProgramProgressDto) {}

export class ProgramProgressResponseDto extends CreateProgramProgressDto {
  @IsString()
  readonly _id: string;
}
