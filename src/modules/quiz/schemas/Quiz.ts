import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Quiz {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  displayName: string;

  @Prop({ required: true })
  videoId: string;

  @Prop({
    type: Map,
    of: { type: MongooseSchema.Types.ObjectId, ref: 'question' },
    required: true,
  })
  questions: Map<number, MongooseSchema.Types.ObjectId>;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
export type QuizDocument = Quiz & Document;
