import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class User {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  nickname: string;

  @Prop({
    type: { type: MongooseSchema.Types.ObjectId, ref: 'Program' },
    required: true,
  })
  joinedProgram: MongooseSchema.Types.ObjectId;

  earnedPoints: { type: number; default: 0 };
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
