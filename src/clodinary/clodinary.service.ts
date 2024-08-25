import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class ClodinaryService {
  constructor() {
    v2.config({
      cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
      api_key: process.env.CLOUDNARY_APIKEY,
      api_secret: process.env.CLOUDNARY_API_SECRET,
    });
  }
  async uploadImage(
    filePath: string,
  ): Promise<UploadApiErrorResponse | UploadApiResponse> {
    return new Promise((resolved, reject) => {
      v2.uploader.upload(
        filePath,
        { folder: 'HOTELbOOKING_NESTAPP' },
        (error, result) => {
          if (error) return reject(error);
          resolved(result);
        },
      );
    });
  }
}
