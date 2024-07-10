import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly serive: UploadService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(@UploadedFile() file: File) {
    return this.serive.uploadImage(file);
  }
}
