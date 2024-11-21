const { db, auth, bucket } = require("../config/firebase"); // Import firestore and auth

const registerUser = async (req, res) => {
  try {
    const { uid, userName, firstName, lastName, email } = req.body; // Get user data from the request body

    // Store additional user information in Firestore under the UID
    await db.collection("users").doc(uid).set({
      userName,
      firstName,
      lastName,
      email,
    });

    // Return a success response
    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user: ", error.message, error.stack);
    return res.status(500).json({ message: "Failed to register user" });
  }
};


const getUserInfo = async (req, res) => {
  try {
    const uid = req.params.uid; // Get user ID from the route parameter
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(userDoc.data());
  } catch (error) {
    console.error("Error getting user info: ", error);
    return res.status(500).json({ message: "Failed to fetch user info" });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const uid = req.params.uid; 
    const { firstName, lastName, userName } = req.body; 

    // Check if all required fields are provided
    if (!firstName || !lastName || !userName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userDocRef = db.collection("users").doc(uid);

    // Check if the document exists
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user document
    await userDocRef.update({
      firstName,
      lastName,
      userName,
    });

    return res.status(200).json({ message: "User info updated successfully" });
  } catch (error) {
    console.error("Error updating user info: ", error);
    return res.status(500).json({ message: "Failed to update user info" });
  }
};


const deleteUser = async (req, res) => {
  try {
    const uid = req.params.uid; // Get user ID from the route parameter

    // Delete the user's Firestore document
    await db.collection("users").doc(uid).delete();

    // Optionally, delete the user from Firebase Auth
    await auth.deleteUser(uid);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user: ", error);
    return res.status(500).json({ message: "Failed to delete user" });
  }
};

module.exports = {
  registerUser,
  getUserInfo,
  updateUserInfo,
  deleteUser,
};
