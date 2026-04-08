const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Artisan = sequelize.define("Artisan", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  // userId will be added by associations in index.js
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
  },
  speciality: {
    type: DataTypes.STRING,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  image: {
    type: DataTypes.STRING,
  },
  about: {
    type: DataTypes.TEXT,
  }
});

module.exports = Artisan;
