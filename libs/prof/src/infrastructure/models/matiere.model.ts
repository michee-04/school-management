import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

@Schema({
  collection: 'matiere',
  timestamps: true,
})
export class Matiere extends Document {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, required: true, unique: true, index: true })
  name: string;

  @Prop({ type: String, required: true, unique: true, index: true })
  code: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true })
  prof: string;

  @Prop({ type: Date, required: true })
  nbHeure: Date;

  @Prop({ type: Date, required: true })
  nbHeureRestant: Date;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const MatiereSchema = SchemaFactory.createForClass(Matiere);

export type MatiereDocument = HydratedDocument<Matiere>;
