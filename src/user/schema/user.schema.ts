import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRolesEnum } from '../types/user.types';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  _id: true,
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, enum: UserRolesEnum })
  role: UserRolesEnum;

  @Prop({ required: true })
  contact: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
