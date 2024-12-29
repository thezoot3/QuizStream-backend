import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class ProgramProgress {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true
  })
  program: string;

  @Prop({ required: true })
  joinCode: string;

  @Prop({ default: 0 })
  currentQuizIndex: number;

  @Prop()
  currentQuiz: string;

  @Prop({ required: true })
  users: string[];

  @Prop({ default: 0 })
  currentVideoTimestamp: number;

  @Prop({ required: true, default: false })
  isSubmittingQuestion: boolean;

  @Prop({ default: null })
  videoPlayerSocketId: string;

  @Prop({ required: true, default: false })
  isStarted: boolean;

  @Prop({ required: true, default: false })
  isEnd: boolean;

  @Prop({ required: true, default: false })
  isPaused: boolean;

  @Prop()
  currentSubVideo: number;

  @Prop({ require: true, default: false })
  isOnSubVideo: boolean;
}

export const ProgramProgressSchema = SchemaFactory.createForClass(ProgramProgress);
export type ProgramProgressDocument = ProgramProgress & Document;
