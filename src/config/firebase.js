require('dotenv').config();
const admin = require('firebase-admin');

console.log("FIREBASE_CONFIG:", process.env.FIREBASE_CONFIG);


const serviceAccount =JSON.parse(process.env.FIREBASE_CONFIG);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, 
 })
 } else {
  admin.app(); // Use the existing app if it's already initialized
}

// Firestore instance
const db = admin.firestore();
const auth = admin.auth();  // Firebase Auth instance
const bucket = admin.storage().bucket();

db.collection("test").get()
  .then(snapshot => {
    console.log("Firebase connection successful!");
  })
  .catch(error => {
    console.error("Firebase connection error:", error);
  });

module.exports = { db, auth, bucket };
