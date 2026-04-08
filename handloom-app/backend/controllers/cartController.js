const { Cart, CartItem, Product } = require("../models");

const getCart = async (req, res, next) => {
  try {
    let [cart] = await Cart.findOrCreate({ where: { userId: req.user.id } });
    
    // Fetch with items
    cart = await Cart.findByPk(cart.id, {
      include: [{ model: CartItem, as: "items", include: [{ model: Product, as: "product" }] }]
    });

    res.json(cart);
  } catch (error) { next(error); }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, qty = 1 } = req.body;
    let [cart] = await Cart.findOrCreate({ where: { userId: req.user.id } });

    const existingItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });

    if (existingItem) {
      await existingItem.update({ qty: existingItem.qty + qty });
    } else {
      await CartItem.create({ cartId: cart.id, productId, qty });
    }

    const updatedCart = await Cart.findByPk(cart.id, {
      include: [{ model: CartItem, as: "items", include: [{ model: Product, as: "product" }] }]
    });
    res.json(updatedCart);
  } catch (error) { next(error); }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { productId, qty } = req.body;
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    if (qty <= 0) {
      await item.destroy();
    } else {
      await item.update({ qty });
    }

    const updatedCart = await Cart.findByPk(cart.id, {
      include: [{ model: CartItem, as: "items", include: [{ model: Product, as: "product" }] }]
    });
    res.json(updatedCart);
  } catch (error) { next(error); }
};

const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    await CartItem.destroy({ where: { cartId: cart.id, productId: req.params.productId } });

    const updatedCart = await Cart.findByPk(cart.id, {
      include: [{ model: CartItem, as: "items", include: [{ model: Product, as: "product" }] }]
    });
    res.json(updatedCart);
  } catch (error) { next(error); }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (cart) {
      await CartItem.destroy({ where: { cartId: cart.id } });
    }
    res.json({ message: "Cart cleared", items: [] });
  } catch (error) { next(error); }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
