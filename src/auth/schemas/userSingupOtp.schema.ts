import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class UserSingupOtp extends Document {
  @Prop()
  email: string;

  @Prop()
  otp: string;
}

export const UserSingupOtpSchema = SchemaFactory.createForClass(UserSingupOtp);
