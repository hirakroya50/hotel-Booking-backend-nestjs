import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'Duplicate email exist'] })
  email: string;

  @Prop()
  picture: string;
  // unic number for google login / genarate by google
  @Prop()
  sub: string;

  @Prop()
  password: string;

  @Prop()
  otp: string;

  @Prop()
  otp_For_reset_password: string;

  @Prop()
  token: string;

  @Prop()
  token_for_forget_Password: string;

  @Prop()
  age: string;

  @Prop()
  country: string;

  @Prop()
  gender: string;

  @Prop({
    type: [
      {
        hotelDetails: SchemaTypes.Mixed,
        booking: [
          {
            monthName: String,
            dates: Array,
          },
        ],
      },
    ],
    required: true,
  })
  bookingDates: {
    hotelDetails: any;
    booking: any[];
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
