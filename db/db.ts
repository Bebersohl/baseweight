import config from './config';
import * as firebase from 'firebase';
import  * as admin from 'firebase-admin';
import serviceAccount from './serviceAccount.json'
import firestoreService from 'firestore-export-import'

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: config.databaseURL
});

export const db = admin.firestore()