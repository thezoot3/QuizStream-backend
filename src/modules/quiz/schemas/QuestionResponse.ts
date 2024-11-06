import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class QuestionResponse {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'programProgress',
    required: true,
  })
  programProgressId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'user', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'quiz', required: true })
  quizId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'question',
    required: true,
  })
  questionId: MongooseSchema.Types.ObjectId;

  submittedAnswer: { type: string; required: true };
  isCorrect: { type: boolean; required: true };
  earnedPoints: { type: number; required: true };
  answeredAt: { type: Date; required: true };
}

export const QuestionResponseSchema =
  SchemaFactory.createForClass(QuestionResponse);
export type QuestionResponseDocument = QuestionResponse & Document;
