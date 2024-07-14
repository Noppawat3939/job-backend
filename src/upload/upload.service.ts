import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { serviceAccount } from 'src/configs';
import { exceptions } from 'src/lib';

@Injectable()
export class UploadService {
  constructor(private readonly config: ConfigService) {}

  async uploadImage(file: Express.Multer.File, name: string) {
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: this.config.get<string>('FIREBASE_STORAGE_BUCKET'),
    });
    const bucket = admin.storage(app).bucket();

    const fileName = `${name}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    try {
      const stream = fileUpload.createWriteStream({ metadata: { contentType: file.mimetype } });
      return new Promise((resolve, reject) => {
        stream.on('error', reject);
        stream.on('finish', () => {
          resolve({ success: true });
        });
        stream.end(file.buffer);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
