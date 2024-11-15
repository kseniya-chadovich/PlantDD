require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));

app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
