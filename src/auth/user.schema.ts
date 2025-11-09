import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  name: string;

  @Prop()
  password?: string;

  @Prop()
  picture?: string;

  @Prop()
  image?: string;

  @Prop({ enum: ['google', 'github'] })
  provider?: string;

  @Prop()
  providerId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
