const { db, auth, bucket } = require("../config/firebase");
const stream = require('stream');

const uploadImageToBucket = async (req, res) => {
  try {
    const { base64ImageString, fileName } = req.body;  // Get the base64 string and file name from the request

    if (!base64ImageString || !fileName) {
      return res.status(400).json({ msg: "Missing image data or file name" });
    }

    // Extract MIME type and clean the base64 string
    const mimeType = base64ImageString.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
    const imageBuffer = Buffer.from(base64ImageString.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    
    // Create a stream for the file
    const bufferStream = new stream.PassThrough();
    bufferStream.end(imageBuffer);

    // Define the file reference in Firebase Storage
    const file = bucket.file(`images/${fileName}`);
    
    // Upload the file to Firebase Storage
    bufferStream.pipe(file.createWriteStream({
      metadata: {
        contentType: mimeType
      },
      public: true,  // Make the file public
      validation: 'md5',  // Validate the upload (optional)
    }))
      .on('error', function (err) {
        console.log('Error uploading image:', err);
        return res.status(500).json({ error: err.message });
      })
      .on('finish', async function () {
        // Once the upload is finished, generate a signed URL
        try {
          const signedUrls = await file.getSignedUrl({
            action: 'read',  // Allow reading the file
            expires: '03-09-2491',  // Long expiration date for the URL
          });

          const pictureURL = signedUrls[0];  // The public URL of the uploaded image
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


// Example function for retrieving requests
const getRequestsByUID = async (req, res) => {
  try {
    const { uid } = req.params;
    const snapshot = await db.collection('requests').where('uid', '==', uid).get();
    const requests = snapshot.docs.map(doc => doc.data());
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching requests', error });
  }
};


// Export controller functions
module.exports = {
  uploadImageToBucket,
  getRequestsByUID,
};
