const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  // We will map artisanId via associations in index.js
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shortDescription: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.ENUM("saree", "kurta", "dress", "menswear", "accessories", "winterwear", "homedecor"),
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  numReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  details: {
    type: DataTypes.JSON, // To support the varied Map-like structure we had
  }
});

module.exports = Product;
