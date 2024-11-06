import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsArray, IsString } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class CreateProgramProgressDto {
  readonly programId: MongooseSchema.Types.ObjectId;

  @IsNumber()
  readonly currentQuizPosition: number;

  @IsArray()
  readonly users: MongooseSchema.Types.ObjectId[];
}

export class UpdateProgramProgressDto extends PartialType(
  CreateProgramProgressDto,
) {}

export class ProgramProgressResponseDto extends CreateProgramProgressDto {
  @IsString()
  readonly _id: string;
}
