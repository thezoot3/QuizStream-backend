import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Program {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  programName: string;

  @Prop({
    required: true
  })
  quizList: string[];
}

export const ProgramSchema = SchemaFactory.createForClass(Program);
export type ProgramDocument = Program & Document;
