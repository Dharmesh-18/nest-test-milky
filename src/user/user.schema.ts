import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password_hash: string;

  @Prop({ required: true })
  role: string;

  @Prop()
  name?: string;

  @Prop({ default: false })
  collectedToday?: boolean;

  @Prop({ type: Number, default: 0.0 })
  monthlyAmount?: number;

  @Prop({ default: false })
  paid?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
