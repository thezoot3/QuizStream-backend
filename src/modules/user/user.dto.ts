import { IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  readonly nickname: string;

  readonly joinedProgram: string;

  readonly earnedPoints: number;

  readonly socketId: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UserResponseDto extends CreateUserDto {
  @IsString()
  readonly _id: string;
}
