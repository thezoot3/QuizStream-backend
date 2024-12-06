import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class QuestionResponse {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true
  })
  programProgressId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  quizId: string;

  @Prop({
    required: true
  })
  submittedAnswer: number;

  @Prop({ required: true })
  isCorrect: boolean;

  @Prop({ required: true })
  earnedPoints: number;

  @Prop({ required: true })
  answeredAt: Date;
}

export const QuestionResponseSchema = SchemaFactory.createForClass(QuestionResponse);
export type QuestionResponseDocument = QuestionResponse & Document;
