const { db, auth, bucket } = require("../config/firebase");

const createRequest = async (req, res) => {
  try {
    const { uid, resultText } = req.body; // Extract user ID and result text from the request
    const file = req.file; // File object from Multer middleware

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Generate a unique file path in the Firebase Storage bucket
    const fileName = `requests/${uid}/${Date.now()}-${file.originalname}`;
    const blob = bucket.file(fileName);
    const stream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Handle stream events
    stream.on("error", (error) => {
      console.error("Error uploading file:", error);
      return res.status(500).json({ message: "Failed to upload file" });
    });

    stream.on("finish", async () => {
      // Make the file publicly accessible and get the URL
      await blob.makePublic();
      const fileURL = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      // Save metadata in Firestore
      const requestDoc = {
        uid,
        fileURL,
        resultText,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection("requests").add(requestDoc);

      return res.status(201).json({
        message: "Request created successfully",
        fileURL,
      });
    });

    stream.end(file.buffer); // Finalize the upload stream
  } catch (error) {
    console.error("Error creating request:", error);
    return res.status(500).json({ message: "Failed to create request" });
  }
};

function getRequestsByUID(){
  return null;
}

// Export controller functions
module.exports = {
  createRequest,
  getRequestsByUID,
};
