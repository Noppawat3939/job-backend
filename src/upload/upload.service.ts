import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase';

@Injectable()
export class UploadService {
  constructor(private readonly firebaseService: FirebaseService) {}

  uploadImage(file: Express.Multer.File) {
    const storage = this.firebaseService.getInstance();
    const bucket = storage.bucket();

    const fileName = `${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const uploadStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });
    return new Promise((resolve, reject) => {
      const uploadPromise = uploadStream.end(file.buffer);
      uploadPromise.on('error', reject);
      uploadPromise.on('finish', () => {});
    });
  }
}
