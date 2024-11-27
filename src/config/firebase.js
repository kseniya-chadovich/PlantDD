require('dotenv').config();
const admin = require('firebase-admin');

console.log("FIREBASE_SERVICE_ACCOUNT:", process.env.FIREBASE_SERVICE_ACCOUNT);


const serviceAccount =JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, 
 })
 } else {
  admin.app(); 
}

const db = admin.firestore();
const auth = admin.auth();  
const bucket = admin.storage().bucket();


db.collection("test").get()
  .then(snapshot => {
    console.log("Firebase connection successful!");
  })
  .catch(error => {
    console.error("Firebase connection error:", error);
  });



module.exports = { db, auth, bucket };
