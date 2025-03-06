import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

@Schema({
  collection: 'otp',
  timestamps: true,
})
export class Otp extends Document {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: String, required: true, index: true })
  email: string;

  @Prop({ type: String })
  phone?: string;

  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: Boolean, default: false })
  used: boolean;

  @Prop({ type: Boolean, default: true })
  isFresh: boolean;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

export type OtpDocument = HydratedDocument<Otp>;

OtpSchema.index({ code: 1, user: 1, used: 1 });
