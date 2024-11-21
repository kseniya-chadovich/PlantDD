
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require("./routes/userRoutes"); 
const requestRoutes = require("./routes/requestRoutes"); 


const app = express();

const corsOptions = {
  origin: "https://wheatplant-ea05f.web.app", // Add your frontend origin here
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
