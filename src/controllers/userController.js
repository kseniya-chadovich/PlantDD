const { db, auth, bucket } = require("../config/firebase");
const stream = require('stream');

const registerUser = async (req, res) => {
  try {
    const { uid, userName, firstName, lastName, email } = req.body; 

    await db.collection("users").doc(uid).set({
      userName,
      firstName,
      lastName,
      email,
    });

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
    const uid = req.params.uid; 
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
    const { firstName, lastName, userName, profileImageUrl } = req.body; 

    if (!firstName || !lastName || !userName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userDocRef = db.collection("users").doc(uid);

    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateData = {
      firstName,
      lastName,
      userName,
    };

    if (profileImageUrl) {
      updateData.profileImageUrl = profileImageUrl;
    }

    await userDocRef.update(updateData);

    return res.status(200).json({ message: "User info updated successfully" });
  } catch (error) {
    console.error("Error updating user info: ", error);
    return res.status(500).json({ message: "Failed to update user info" });
  }
};


const uploadProfileToBucket = async (req, res) => {
  try {
    const file = req.file; 

    if (!file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const fileName = file.originalname; 
    const mimeType = file.mimetype; 
    const imageBuffer = file.buffer; 

    const bufferStream = new stream.PassThrough();
    bufferStream.end(imageBuffer);

    const firebaseFile = bucket.file(`profiles/${fileName}`);

    bufferStream.pipe(
      firebaseFile.createWriteStream({
        metadata: {
          contentType: mimeType,
        },
        public: true,
        validation: 'md5', 
      })
    )
      .on('error', function (err) {
        console.log('Error uploading image:', err);
        return res.status(500).json({ error: err.message });
      })
      .on('finish', async function () {
        
        try {
          const signedUrls = await firebaseFile.getSignedUrl({
            action: 'read', 
            expires: '03-09-2491', 
          });

          const pictureURL = signedUrls[0];
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
