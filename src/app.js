
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require("./routes/userRoutes"); 
const requestRoutes = require("./routes/requestRoutes"); 


const app = express();

const corsOptions = {
  origin: "https://wheatplant-ea05f.web.app", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.use(express.json()); 
app.use(bodyParser.json({ limit: '10mb' }));  
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
