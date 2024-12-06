import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class User {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  socketId: string;

  @Prop({ required: true })
  nickname: string;

  @Prop({
    required: true
  })
  joinedProgram: string;

  @Prop({ default: 0, required: true })
  earnedPoints: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
