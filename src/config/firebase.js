// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrBrPuFDQ0FactSP0L2IByXiDpn5ApTQs",
  authDomain: "wheatplant-ea05f.firebaseapp.com",
  projectId: "wheatplant-ea05f",
  storageBucket: "wheatplant-ea05f.firebasestorage.app",
  messagingSenderId: "226944092427",
  appId: "1:226944092427:web:cebb6a9d993c94bce27a0e",
  measurementId: "G-YXMRE8S7JX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);