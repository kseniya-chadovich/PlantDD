const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require("./routes/userRoutes"); 
const requestRoutes = require("./routes/requestRoutes"); 


const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = ["https://wheatplant-ea05f.web.app"];
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"], // Add the HTTP methods you need
  credentials: true, // If you're using cookies/authentication
}));
  // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
