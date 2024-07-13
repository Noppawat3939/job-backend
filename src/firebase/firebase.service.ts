import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { firebaseSDK } from 'src/configs';

@Injectable()
export class FirebaseService {
  private readonly storage: admin.storage.Storage;
  constructor(private readonly config: ConfigService) {
    const serviceAccount = firebaseSDK as admin.ServiceAccount;

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: this.config.get('FIREBASE_DB_URL'),
      storageBucket: this.config.get('FIREBASE_STORAGE_BUCKET'),
    });

    this.storage = admin.storage();
  }

  getInstance() {
    return this.storage;
  }
}
