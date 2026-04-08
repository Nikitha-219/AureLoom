const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  }
  // userId added via associations
});

const CartItem = sequelize.define("CartItem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  qty: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  }
});

module.exports = { Cart, CartItem };
