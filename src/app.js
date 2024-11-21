const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require("./routes/userRoutes"); 
const requestRoutes = require("./routes/requestRoutes"); 


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());  // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
