const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,   // Keep user_id as the primary key
    autoIncrement: true,  
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  // Ensure user_name is unique, but not a primary key
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  // Optionally make email unique
  }
}, {
  timestamps: false,  
  tableName: 'users', 
});

module.exports = User;
