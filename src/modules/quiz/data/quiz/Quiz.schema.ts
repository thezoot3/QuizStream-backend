import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Quiz {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  displayName: string;

  @Prop({ required: true })
  videoId: string;

  @Prop({ required: true, default: 0 })
  questionTriggerTime: number;

  @Prop({ required: true })
  videoDuration: number;

  @Prop({ required: true })
  questionText: string;

  @Prop({ required: true })
  options: string[];

  @Prop({ required: true })
  submittingDuration: number;

  @Prop({ required: true })
  points: number[];

  @Prop({ required: true })
  subVideoByOptions: Array<{ duration: number; videoId: string } | null>;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
export type QuizDocument = Quiz & Document;
