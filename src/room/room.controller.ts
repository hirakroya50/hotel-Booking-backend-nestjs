import {
  Body,
  Post,
  UploadedFile,
  UseInterceptors,
  Controller,
  Get,
  UseGuards,
  Param,
  NotFoundException,
  Put,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RoomService } from './room.service';
import { CloudinaryuplodeService } from './cloudinaryuplode.service';

@Controller('api/v1/room')
export class RoomController {
  constructor(
    // private itemService: RoomService,
    private readonly cloudanaryService: CloudinaryuplodeService,
    private readonly roomService: RoomService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uplodeFile(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    room: any, //room dto
  ) {
    const upload = await this.roomService.uploadRoomData('result.url', room);
    return upload;
  }

  @Get('/home')
  getRoomsForHomePage() {
    return this.roomService.getRoomDataForHomePage();
  }
  @Get('/all')
  getAllRooms() {
    return this.roomService.getAllRooms();
  }

  @Get('/unit/:id')
  getRoomsById(@Param('id') id: string) {
    return this.roomService.getRoomDataById(id);
  }

  @Post('/bookRoom')
  bookrooms(
    @Body('roomId') roomId: string,
    @Body('monthAndDate')
    monthAndDate: { monthName: string; dates: string[] }[],
    @Body('userId') userId: string,
  ) {
    // return { working: 'book romm route', roomId, monthAndDate, userId };
    return this.roomService.bookRoom(roomId, monthAndDate, userId);
  }

  @Get('/search/:place')
  searchRooms(@Param('place') place: string) {
    return this.roomService.searchRoomsByPlace(place);
  }

  @Put('/comment')
  postACommentR(
    @Body('roomId') roomId: string,
    @Body('commentData')
    commentData: any,
  ): Promise<any> {
    // console.log(commentData, roomId);
    // return { stra: 'sshssh' };
    return this.roomService.postAComment(roomId, commentData);
  }
}
//post a comment is paining
// @Get()
// @UseGuards(AuthGuard())
// async getAllItmes(): Promise<any> {
//   return this.itemService.findAllBooks();
// }
