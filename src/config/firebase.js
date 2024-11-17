const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8')
);
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
