import { IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateProgramDto {
  @IsString()
  readonly programName: string;

  @IsString({ each: true })
  readonly quizList: string[];
}

export class UpdateProgramDto extends PartialType(CreateProgramDto) {}

export class ProgramResponseDto extends CreateProgramDto {
  @IsString()
  readonly _id: string;
}
