const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ImageReference = sequelize.define("ImageReference", {
  image_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users", // Assumes a users table exists
      key: "user_id",
    },
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  uploaded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = ImageReference;
