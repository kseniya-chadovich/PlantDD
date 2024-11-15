require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');
const routes = require('./routes');

// Firebase imports
const { initializeApp } = require("firebase/app");
const { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} = require("firebase/auth");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
const firebaseConfig = require("./public/js/firebase-config.js");

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const dbFirestore = getFirestore(firebaseApp);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware
app.use(cors({
  origin: 'http://127.0.0.1:5500' // Adjust the origin as needed for your environment
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// Example Firebase function endpoints

// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, firstName, lastName, userName } = req.body;

  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Add additional user details to Firestore
    await setDoc(doc(dbFirestore, "users", userCredential.user.uid), {
      email,
      firstName,
      lastName,
      userName,
      uid: userCredential.user.uid,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// Password reset endpoint
app.post('/api/auth/reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    await sendPasswordResetEmail(auth, email);
    res.status(200).json({ message: "Password reset email sent!" });
  } catch (error) {
    console.error("Error sending password reset email:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// Add other routes
app.use('/api', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
