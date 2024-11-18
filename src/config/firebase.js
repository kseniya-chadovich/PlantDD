const admin = require('firebase-admin');

// Initialize the Firebase Admin app with the service account
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped newlines
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
});
} else {
  admin.app(); // Use the existing app if it's already initialized
}

// Firestore instance
const db = admin.firestore();
const auth = admin.auth();  // Firebase Auth instance

module.exports = { db, auth };
