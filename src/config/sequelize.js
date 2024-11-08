// src/config/sequelize.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

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
