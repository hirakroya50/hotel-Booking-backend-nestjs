import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './schemas/room.schema';
import { User } from '../auth/schemas/user.schema';
import { data } from './room.data';
@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name)
    private readonly roomModel: Model<Room>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async uploadRoomData() {
    try {
      // Your logic for uploading room data
      const upload = await this.roomModel.create(data);
      return { upload };
    } catch (error) {
      console.error('Error in uploadRoomData:', error);
      throw new Error('Failed to upload room data');
    }
  }

  async getRoomDataForHomePage() {
    try {
      const roomsData = await this.roomModel.find({}).limit(8).exec();

      if (!roomsData) {
        throw new NotFoundException('No rooms found.');
      }
      return { status: 1, roomsData, totalrooms: roomsData?.length };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        console.error(error);

        throw new InternalServerErrorException(
          'Internal server error occurred.',
        );
      }
    }
  }

  async getRoomDataById(id: string) {
    try {
      if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
        // Check if id is not provided or not a valid ObjectId
        throw new BadRequestException('Invalid room ID.');
      }
      const room = await this.roomModel.findOne({ _id: id });
      if (!room) {
        throw new NotFoundException('No rooms found.');
      }
      return room;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error; // Re-throw the NotFoundException as is
      } else {
        throw new InternalServerErrorException(
          'Internal server error occurred.',
        );
      }
    }
  }

  async getAllRooms() {
    try {
      const roomsData = await this.roomModel.find({}).exec();

      if (!roomsData) {
        throw new NotFoundException('No rooms found.');
      }
      return { status: 1, roomsData, totalrooms: roomsData?.length };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        console.error(error);

        throw new InternalServerErrorException(
          'Internal server error occurred.',
        );
      }
    }
  }

  async bookRoom(
    roomId: string,
    monthAndDate: { monthName: string; dates: string[] }[],
    userId: string,
  ) {
    try {
      //check the room and user is exist or not is exist
      const room = await this.roomModel.findById({ _id: roomId });
      const user = await this.userModel.findById({ _id: userId });
      if (!room) throw new NotFoundException('Room not found.');
      if (!user) throw new NotFoundException('User not found.');

      //  Update the room's availability based on the provided month and dates
      const { monthName, dates } = monthAndDate[0];

      //checking the month is present ot not / abalabale or noit
      const existingMonth = room.abilibiity.find(
        (entry) => entry.monthNmae === monthName,
      );

      // get the available dates as array in the months
      const abatableDates = existingMonth?.bookDates;

      if (existingMonth) {
        if (existingMonth.bookDates.length == 0) {
          //do the logic if , dont have any dates
          return {
            status: 0,
            message: 'booing dates not available. booking not possible',
            abatableDates,
          };
        }
        existingMonth.bookDates = existingMonth.bookDates.filter(
          (date) => !dates.includes(date.toString()),
        );
        // check if all the booking request dates are not available
        if (
          dates.length >
          abatableDates.length - existingMonth.bookDates.length
        ) {
          // throw new BadRequestException('Invalid room ID.', 'hhhhhhh', '');
          return {
            status: 0,
            message: 'booing dates mot available. booking not possible',
            abatableDates,
          };
        }
      } else {
        //do the logic if the request months does not exist
        return {
          status: 0,
          message: 'booing Month mot available. booking not possible',
          abatableDates: [],
        };
      }

      // Add booking details to the user data
      const bookingDatesData = {
        hotelDetails: room.toObject(),
        booking: monthAndDate,
      };
      user.bookingDates.push(bookingDatesData);

      // Save the updated user data and room data
      await room.save();
      await user.save();

      // Return the updated room and user data
      return {
        status: 1,
        message: 'booking successful',
        abatableDates,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error; // Re-throw the NotFoundException as is
      } else {
        // Log the error for debugging purposes
        console.error(error);

        throw new InternalServerErrorException(
          'Internal server error occurred.',
        );
      }
    }
  }

  async searchRoomsByPlace(place: string): Promise<Room[]> {
    try {
      const regex = new RegExp(place, 'i');
      const roomsArray = await this.roomModel.find({
        keywordForPlaces: { $in: [regex] },
      });
      return roomsArray;
      // let roomsArray = await this.roomModel.find({ keywordForPlaces: place });
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException('Internal server error occurred.');
    }
  }

  async postAComment(roomId: string, commentData: CommentRequest) {
    try {
      const { message, rating, userEmail, userImage, userName } = commentData;
      const updatedRoom = await this.roomModel.findByIdAndUpdate(
        {
          _id: roomId,
        },
        {
          $push: {
            comments: {
              message,
              rating,
              userEmail,
              userImage,
              userName,
            },
          },
        },
        { new: true },
      );

      if (!updatedRoom) {
        throw new NotFoundException('Room not found.');
      }

      return { updatedRoom };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      } else {
        console.error(error);
        throw new InternalServerErrorException(
          'Internal server error occurred.',
        );
      }
    }
  }
}

interface CommentRequest {
  userName: string;
  message: string;
  userImage: string;
  rating: number;
  userEmail: string;
}
