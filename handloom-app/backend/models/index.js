const { sequelize } = require("../config/db");
const User = require("./User");
const Product = require("./Product");
const Artisan = require("./Artisan");
const { Cart, CartItem } = require("./Cart");
const { Order, OrderItem } = require("./Order");
const Wishlist = require("./Wishlist");
const Review = require("./Review");

// 1. User <-> Artisan
User.hasOne(Artisan, { foreignKey: "userId", onDelete: "CASCADE" });
Artisan.belongsTo(User, { foreignKey: "userId" });

// 2. Artisan <-> Product
Artisan.hasMany(Product, { foreignKey: "artisanId", onDelete: "CASCADE" });
Product.belongsTo(Artisan, { foreignKey: "artisanId" });

// 3. User <-> Cart
User.hasOne(Cart, { foreignKey: "userId", onDelete: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "userId" });

// 4. Cart <-> CartItems <-> Products
Cart.hasMany(CartItem, { foreignKey: "cartId", onDelete: "CASCADE", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });

Product.hasMany(CartItem, { foreignKey: "productId", onDelete: "CASCADE" });
CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// 5. User <-> Order
User.hasMany(Order, { foreignKey: "userId", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "userId" });

// 6. Order <-> OrderItems <-> Products
Order.hasMany(OrderItem, { foreignKey: "orderId", onDelete: "CASCADE", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderItem, { foreignKey: "productId", onDelete: "SET NULL" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// 7. User <-> Wishlist
User.hasOne(Wishlist, { foreignKey: "userId", onDelete: "CASCADE" });
Wishlist.belongsTo(User, { foreignKey: "userId" });

// 8. Wishlist <-> Product (Many to Many mapping table)
const WishlistProduct = sequelize.define('WishlistProduct', {}, { timestamps: false });
Wishlist.belongsToMany(Product, { through: WishlistProduct, foreignKey: "wishlistId", as: "products" });
Product.belongsToMany(Wishlist, { through: WishlistProduct, foreignKey: "productId" });

// 9. Review associations
User.hasMany(Review, { foreignKey: "userId", onDelete: "CASCADE" });
Review.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(Review, { foreignKey: "productId", onDelete: "CASCADE", as: "reviews" });
Review.belongsTo(Product, { foreignKey: "productId" });

module.exports = {
  sequelize,
  User,
  Product,
  Artisan,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Wishlist,
  Review
};
