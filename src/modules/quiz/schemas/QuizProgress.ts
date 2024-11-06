import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class QuizProgress {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    type: { type: MongooseSchema.Types.ObjectId, ref: 'programProgress' },
  })
  programProgressId: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    type: { type: MongooseSchema.Types.ObjectId, ref: 'quiz' },
  })
  currentQuizId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, default: 0 })
  currentVideoTimestamp: number;

  @Prop({ required: true, default: 0 })
  currentQuestionIndex: number;
}

export const QuizProgressSchema = SchemaFactory.createForClass(QuizProgress);
export type QuizProgressDocument = QuizProgress & Document;
