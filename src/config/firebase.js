const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./wheatplant.json');  // Replace with the path to your Firebase service account key file

// Initialize the Firebase Admin app with the service account
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://wheatplant-ea05f.firebaseio.com'
  });
} else {
  admin.app(); // Use the existing app if it's already initialized
}

// Firestore instance
const db = admin.firestore();
const auth = admin.auth();  // Firebase Auth instance

module.exports = { db, auth };
