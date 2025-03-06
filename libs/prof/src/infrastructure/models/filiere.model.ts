import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

@Schema({
  collection: 'filiere',
  timestamps: true,
})
export class Filiere extends Document {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, unique: true, required: true, index: true })
  name: string;

  @Prop({ type: String, required: true })
  niveau: string;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const FiliereSchema = SchemaFactory.createForClass(Filiere);

export type FiliereDocument = HydratedDocument<Filiere>;
