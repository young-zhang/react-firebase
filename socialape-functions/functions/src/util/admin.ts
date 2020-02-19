import * as admin from 'firebase-admin';
import * as firebase from "firebase";
import firebaseConfig from "../firebaseConfig";

admin.initializeApp();
firebase.initializeApp(firebaseConfig);
const db = admin.firestore();

export {admin, db};