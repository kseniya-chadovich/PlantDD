const { db, auth, bucket } = require("../config/firebase");


// Function to handle file upload
const createRequest = async (req, res) => {
  console.log("got to the backend function");
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get file data from the request
    const fileBuffer = req.file.buffer;  // The file data
    const fileName = `${Date.now()}_${req.file.originalname}`;  // Unique file name

    // Upload file to Firebase Storage
    const file = bucket.file(`uploads/${fileName}`);
    const uploadStream = file.createWriteStream();

    uploadStream.end(fileBuffer); // End the stream and upload the file

    uploadStream.on('finish', async () => {
      // Store the file URL and metadata in Firestore
      const fileUrl = `gs://${bucket.name}/uploads/${fileName}`;
      await db.collection('requests').add({
        fileUrl: fileUrl,
        description: req.body.description,
        createdAt: new Date(),
      });

      res.status(200).send({ message: 'File uploaded successfully!', fileUrl: fileUrl });
    });

    uploadStream.on('error', (error) => {
      res.status(500).send({ message: 'Error uploading file', error });
    });

  } catch (error) {
    res.status(500).send({ message: 'Error processing request', error });
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
  createRequest,
  getRequestsByUID,
};
