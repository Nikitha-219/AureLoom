const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  shippingAddress: {
    type: DataTypes.JSON,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: "COD",
  },
  paymentStatus: {
    type: DataTypes.ENUM("pending", "completed", "failed"),
    defaultValue: "pending",
  },
  orderStatus: {
    type: DataTypes.ENUM("processing", "shipped", "delivered", "cancelled"),
    defaultValue: "processing",
  },
  placedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
});

const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  image: DataTypes.STRING,
  price: DataTypes.FLOAT,
  qty: DataTypes.INTEGER,
});

module.exports = { Order, OrderItem };
