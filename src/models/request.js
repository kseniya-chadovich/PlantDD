const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Request = sequelize.define('RequestHistory', {
  req_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', 
      key: 'user_id',  
    },
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
},
{
  timestamps: false,  
  tableName: 'request_history',  
});

module.exports = Request;
