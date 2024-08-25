import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryuplodeService } from './cloudinaryuplode.service';
import { MulterModule } from '@nestjs/platform-express';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './schemas/room.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: User.name, schema: UserSchema },
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [RoomController],
  providers: [RoomService, CloudinaryuplodeService],
})
export class RoomModule {}
