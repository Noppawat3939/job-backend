import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { firebaseSDK } from 'src/configs';
import { FirebaseService } from './firebase.service';

const firebaseProvider = {
  provide: 'FIREBASE_APP',
  inject: [ConfigService],
  useFactory(config: ConfigService) {
    return admin.initializeApp({
      credential: admin.credential.cert(firebaseSDK as admin.ServiceAccount),
      databaseURL: config.get<string>('FIREBASE_DB_URL'),
      storageBucket: config.get<string>('FIREBASE_STORAGE_BUCKET'),
    });
  },
};

@Module({
  // providers: [firebaseProvider],
  // exports: [],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
