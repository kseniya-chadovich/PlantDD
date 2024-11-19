const { storage } = require("../config/firebase");
const { v4: uuidv4 } = require("uuid");

// Function to upload file and get URL
async function uploadFile(file) {
  try {
    // Generate a unique filename with UUID
    const fileName = `${uuidv4()}_${file.originalname}`;
    const fileRef = storage.ref().child(fileName);

    // Upload file to Firebase Storage
    const snapshot = await fileRef.put(file.buffer);

    // Get download URL
    const downloadURL = await snapshot.ref.getDownloadURL();
    return downloadURL; // Return the URL to store in your MySQL database
  } catch (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
}

module.exports = { uploadFile };
