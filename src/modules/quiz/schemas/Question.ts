import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Question {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  questionText: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ required: true })
  correctAnswer: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true, default: 1 })
  points: number;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
export type QuestionDocument = Question & Document;
