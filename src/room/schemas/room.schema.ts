import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
//nb: for room booking revise dthe abalable dates data , a
// amon kore data ta ready korte hbvbe jono room booking route a subida hoy
// comment  e user er data add korte hbe / user er id add korte hbe jei user comment post korbe
//add place name or any keyword array so that user can search by name of the hotel location
@Schema({
  timestamps: true,
})
export class Room extends Document {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  keywordForPlaces: string[];

  @Prop({ required: true })
  describtion: string;

  @Prop({ type: Object, required: true })
  abalableServices: {
    smartPhone: boolean;
    miniBar: boolean;
    Sauna: boolean;
    Breakfast: boolean;
    Hairdryer: boolean;
    Coffeemaker: boolean;
    WidescreenTv: boolean;
  };

  @Prop({ type: [String], required: true })
  aditionalServices: string[];

  @Prop({ required: true })
  pricePerNight: string;

  @Prop({ required: true })
  imageurl: string;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ required: true })
  maxGuest: number;

  @Prop({ type: [{ monthNmae: String, bookDates: [Number] }], required: true })
  abilibiity: { monthNmae: string; bookDates: number[] }[];

  @Prop({
    type: [
      {
        userName: String,
        message: String,
        userImage: String,
        rating: Number,
        userEmail: String,
      },
    ],
    required: true,
  })
  comments: {
    userName: string;
    message: string;
    userImage: string;
    rating: number;
    userEmail: string;
  }[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
