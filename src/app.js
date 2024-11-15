require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY, // Stored in .env for security
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());  // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Example Signup Route
app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Create a user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Return success response with user info (excluding sensitive data)
    res.status(201).json({
      message: "User created successfully!",
      uid: user.uid,
      email: user.email,
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(400).json({
      error: error.message, // Send error message in the response
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
