const firebaseConfig = {
  apiKey: "AIzaSyDrBrPuFDQ0FactSP0L2IByXiDpn5ApTQs",
  authDomain: "wheatplant-ea05f.firebaseapp.com",
  projectId: "wheatplant-ea05f",
  storageBucket: "wheatplant-ea05f.firebasestorage.app",
  messagingSenderId: "226944092427",
  appId: "1:226944092427:web:cebb6a9d993c94bce27a0e",
  measurementId: "G-YXMRE8S7JX",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized in firebase-config");
} else {
  console.log("Firebase app already initialized");
}
