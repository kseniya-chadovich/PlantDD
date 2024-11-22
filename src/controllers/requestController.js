const { db, auth, bucket } = require("../config/firebase");
const stream = require('stream');

const uploadImageToBucket = async (req, res) => {
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
    const firebaseFile = bucket.file(`images/${fileName}`);

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



const storeLinkToRequest = async (req, res) => {
  try {
    const { uid, link, description } = req.body; // Extract UID and link from the request body

    // Validate input
    if (!uid || !link || !description) {
      return res.status(400).json({ message: "UID, link, and desc are required." });
    }

    // Reference the document for the user
    const docRef = db.collection("requests").doc(uid);

    // Get the current document for the user
    const doc = await docRef.get();

    if (doc.exists) {
      // If the document exists, append the link to the existing array
      const existingPairs = doc.data().pairs || [];
      await docRef.set(
        { pairs: [...existingPairs, { link, description }] }, // Add the new pair to the array
        { merge: true } // Ensure we do not overwrite other fields
      );
      
    } else {
      await docRef.set({
        pairs: [{ link, description }],
      });
    }

    // Return a success response
    return res.status(201).json({
      message: "Link stored successfully",
    });
  } catch (error) {
    console.error("Error storing the link:", error.message, error.stack);
    return res.status(500).json({ message: `Failed to store the link: ${error.message}` });
  }
};


const getRequestsByUID = async (req, res) => {
  try {
    const { uid } = req.params; // Extract UID from the request parameters

    // Validate input
    if (!uid) {
      return res.status(400).json({ message: "UID is required." });
    }

    // Reference the document for the user
    const docRef = db.collection("requests").doc(uid);

    // Get the current document for the user
    const doc = await docRef.get();

    if (doc.exists) {
      // If the document exists, return the pairs array
      const pairs = doc.data().pairs || [];
      return res.status(200).json({
        message: "Links retrieved successfully.",
        pairs,
      });
    } else {
      // If the document does not exist, return an empty response
      return res.status(404).json({
        message: "No data found for the provided UID.",
        pairs: [],
      });
    }
  } catch (error) {
    console.error("Error retrieving links:", error.message, error.stack);
    return res.status(500).json({ message: `Failed to retrieve links: ${error.message}` });
  }
};


// Export controller functions
module.exports = {
  uploadImageToBucket,
  storeLinkToRequest,
  getRequestsByUID,
};
