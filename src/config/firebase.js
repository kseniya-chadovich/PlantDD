const admin = require('firebase-admin');

var serviceAccount = require(".wheatplant-ea05f-firebase-adminsdk-p89ex-861a52ce12.json");

// Initialize the Firebase Admin app with the service account
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  admin.app(); // Use the existing app if it's already initialized
}

// Firestore instance
const db = admin.firestore();
const auth = admin.auth();  // Firebase Auth instance

module.exports = { db, auth };
