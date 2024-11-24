
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require("./routes/userRoutes"); 
const requestRoutes = require("./routes/requestRoutes"); 


const app = express();

const corsOptions = {
  origin: ["https://plantdd-78c88.web.app", "https://wheatplant-ea05f.web.app"], // Add your frontend origin here
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON request bodies
app.use(bodyParser.json({ limit: '10mb' }));  // You can adjust the size as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
