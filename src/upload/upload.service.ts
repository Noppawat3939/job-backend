import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  constructor() {}

  uploadImage(file: File) {
    console.log(1, file);
    return 'OK';
  }
}
