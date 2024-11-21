const { db, auth, bucket } = require("../config/firebase");

const createRequest = async (req, res) => {
  try {
    const { uid, resultText } = req.body;
    const file = req.file; // File uploaded via Multer

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Generate a unique file path in the Firebase Storage bucket
    const fileName = `requests/${uid}/${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    // Create a write stream and upload the file
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on("error", (error) => {
      console.error("Error uploading file:", error);
      return res.status(500).json({ message: "Failed to upload file" });
    });

    stream.on("finish", async () => {
      // Make the file publicly accessible (optional)
      await fileUpload.makePublic();
      const fileURL = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;

      // Save metadata to Firestore
      const requestDoc = {
        uid,
        fileURL,
        resultText,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection("requests").add(requestDoc);

      res.status(201).json({ message: "Request created successfully", fileURL });
    });

    stream.end(file.buffer);
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ message: "Failed to create request" });
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
