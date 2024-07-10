const {
  FIREBASE_PROJECT_ID: project_id,
  FIREBASE_PRIVATE_KEY_ID: private_key_id,
  FIREBASE_CLIENT_ID: client_id,
  FIREBASE_PRIVATE_KEY: private_key,
  FIREBASE_CLIENT_EMAIL: client_email,
} = process.env;

export const firebaseSDK = {
  type: 'service_account',
  project_id,
  private_key_id,
  private_key,
  client_email,
  client_id,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-eejdq%40job-backend.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};
