const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,  
    autoIncrement: true,  
    allowNull: false,
    unique: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_name: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,  
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
  }
}, {
  timestamps: false,  
  tableName: 'users', 
});

module.exports = User;
