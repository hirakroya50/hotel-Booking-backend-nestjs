import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ClodinaryService } from './clodinary.service';
// import { CloudinaryService } from './cloudinary.service';
@Controller('clodinary')
export class ClodinaryController {
  constructor(private readonly cloudanaryService: ClodinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uplodeFile(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    room: any, //room dto
  ) {
    try {
      // const result = await this.cloudanaryService.uploadImage(file.path);
      // console.log(result.url);
      // return result;
      console.log(file);
      return { file };
    } catch (error) {
      console.log('error on uploding', error);
      throw new Error('Failed to uplode');
    }
  }
}
