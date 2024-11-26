const { db, auth, bucket } = require("../config/firebase"); // Import firestore and auth
const stream = require('stream');

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
    const { firstName, lastName, userName, profileImageUrl } = req.body; // profileImageUrl is optional

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

    // Prepare the update object with required fields
    const updateData = {
      firstName,
      lastName,
      userName,
    };

    // Only add profileImageUrl to the update data if it is provided
    if (profileImageUrl) {
      updateData.profileImageUrl = profileImageUrl;
    }

    // Update the user document with the prepared data
    await userDocRef.update(updateData);

    return res.status(200).json({ message: "User info updated successfully" });
  } catch (error) {
    console.error("Error updating user info: ", error);
    return res.status(500).json({ message: "Failed to update user info" });
  }
};


const uploadProfileToBucket = async (req, res) => {
  try {
    const file = req.file; // Access the uploaded file via Multer

    if (!file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const fileName = file.originalname; // Get the original file name
    const mimeType = file.mimetype; // MIME type of the uploaded file
    const imageBuffer = file.buffer; // File content as a buffer

    // Create a stream for the file
    const bufferStream = new stream.PassThrough();
    bufferStream.end(imageBuffer);

    // Define the file reference in Firebase Storage
    const firebaseFile = bucket.file(`profiles/${fileName}`);

    // Upload the file to Firebase Storage
    bufferStream.pipe(
      firebaseFile.createWriteStream({
        metadata: {
          contentType: mimeType,
        },
        public: true, // Make the file public
        validation: 'md5', // Validate the upload (optional)
      })
    )
      .on('error', function (err) {
        console.log('Error uploading image:', err);
        return res.status(500).json({ error: err.message });
      })
      .on('finish', async function () {
        // Once the upload is finished, generate a signed URL
        try {
          const signedUrls = await firebaseFile.getSignedUrl({
            action: 'read', // Allow reading the file
            expires: '03-09-2491', // Long expiration date for the URL
          });

          const pictureURL = signedUrls[0]; // The public URL of the uploaded image
          return res.status(200).json({ msg: 'SUCCESS', pictureURL });
        } catch (err) {
          console.log('Error getting signed URL:', err);
          return res.status(500).json({ error: err.message });
        }
      });
  } catch (err) {
    console.log('Error in uploadImageToBucket function:', err);
    return res.status(500).json({ error: err.message });
  }
};



module.exports = {
  registerUser,
  getUserInfo,
  updateUserInfo,
  uploadProfileToBucket,
};
