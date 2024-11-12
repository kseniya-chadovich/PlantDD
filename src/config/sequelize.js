// src/config/sequelize.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql', // or 'postgres', 'sqlite', etc.
  host: process.env.DB_ROOT, // Adjust if needed
  username: process.env.DB_USER, // Update with actual DB username
  password: process.env.DB_PASSWORD, // Update with actual DB password
  database: process.env.DB_NAME, // Update with the name of your database
});

// Test the Sequelize connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to MySQL with Sequelize');
  })
  .catch((err) => {
    console.error('Unable to connect to MySQL with Sequelize:', err);
  });

module.exports = sequelize;
