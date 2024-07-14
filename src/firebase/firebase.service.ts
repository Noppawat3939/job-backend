import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { firebaseSDK } from 'src/configs';

import serviceAccount from '../configs/firebase.service.account.json';

@Injectable()
export class FirebaseService {
  private readonly storage: admin.storage.Storage;
  private readonly config: ConfigService;
  private app: admin.app.App;
  constructor() {
    // const serviceAccount = require('../configs/firebase.service.account.json');
    // const databaseURL = this.config.get<string>('FIREBASE_DB_URL');
    // const storageBucket = this.config.get<string>('FIREBASE_STORAGE_BUCKET');
    // admin.initializeApp({
    //   credential: admin.credential.cert(fbConfig as admin.ServiceAccount),
    //   // databaseURL: 'https://job-backend.firebaseio.com',
    //   storageBucket: 'gs://job-backend.appspot.com',
    // });
    // this.storage = admin.storage();
  }

  async getStorageBucket() {
    this.app = await admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      databaseURL: 'https://job-backend.firebaseio.com',
      storageBucket: 'gs://job-backend.appspot.com',
    });

    return admin.storage(this.app).bucket();
  }
}
