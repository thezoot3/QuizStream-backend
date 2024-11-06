import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class ProgramProgress {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Program',
    required: true,
  })
  programId: MongooseSchema.Types.ObjectId;

  currentQuizPosition: { type: number; required: true };

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', required: true })
  users: MongooseSchema.Types.ObjectId[];
}

export const ProgramProgressSchema =
  SchemaFactory.createForClass(ProgramProgress);
export type ProgramProgressDocument = ProgramProgress & Document;
