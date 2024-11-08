require('dotenv').config();
const mysql = require('mysql2');

// MySQL Connection (Non-pooling)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + db.threadId);
});

module.exports = db;