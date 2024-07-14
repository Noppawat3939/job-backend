import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import serviceAccount from '../configs/firebase.service.account.json';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private readonly config: ConfigService) {} // private readonly firebaseService: FirebaseService

  async uploadImage(file: Express.Multer.File) {
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      storageBucket: this.config.get<string>('FIREBASE_STORAGE_BUCKET'),
    });

    const bucket = admin.storage(app).bucket();

    const fileName = `${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    try {
      const stream = fileUpload.createWriteStream({ metadata: { contentType: file.mimetype } });

      return new Promise((resolve, reject) => {
        stream.on('error', reject);
        stream.on('finish', () => {
          resolve(true);
        });
        stream.end(file.buffer);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
