const { db, auth, bucket } = require("../config/firebase");
const stream = require('stream');

const uploadImageToBucket = async (req, res) => {
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

    
    const firebaseFile = bucket.file(`images/${fileName}`);

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



const storeLinkToRequest = async (req, res) => {
  try {
    const { uid, link, description } = req.body; 

    if (!uid || !link || !description) {
      return res.status(400).json({ message: "UID, link, and desc are required." });
    }

    
    const docRef = db.collection("requests").doc(uid);

   
    const doc = await docRef.get();

    if (doc.exists) {
      
      const existingPairs = doc.data().pairs || [];
      await docRef.set(
        { pairs: [...existingPairs, { link, description }] }, 
        { merge: true } 
      );
      
    } else {
      await docRef.set({
        pairs: [{ link, description }],
      });
    }

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
    const { uid } = req.params; 

    
    if (!uid) {
      return res.status(400).json({ message: "UID is required." });
    }

    
    const docRef = db.collection("requests").doc(uid);

   
    const doc = await docRef.get();

    if (doc.exists) {
      
      const pairs = doc.data().pairs || [];
      return res.status(200).json({
        message: "Links retrieved successfully.",
        pairs,
      });
    } else {
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


module.exports = {
  uploadImageToBucket,
  storeLinkToRequest,
  getRequestsByUID,
};
