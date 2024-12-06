import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.provider';
import { QuizModule } from '../quiz/quiz.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserController } from './user.controller';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), forwardRef(() => QuizModule)],
  exports: [UserService]
})
export class UserModule {}
