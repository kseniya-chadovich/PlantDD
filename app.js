// src/app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db'); // initialize MySQL db
const routes = require('./routes'); // Import all routes

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api', routes);

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
