const { Order, OrderItem, Cart, CartItem, Product } = require("../models");

const placeOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{ model: CartItem, as: "items", include: [{ model: Product, as: "product" }] }]
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty. Add items before checkout." });
    }

    const orderItems = cart.items.map(item => ({
      productId: item.productId,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      qty: item.qty
    }));

    const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);

    const order = await Order.create({
      userId: req.user.id,
      totalPrice,
      shippingAddress: shippingAddress || {},
      paymentMethod: paymentMethod || "COD"
    });

    // Create OrderItems records linked to this order
    for (let item of orderItems) {
      await OrderItem.create({ ...item, orderId: order.id });
    }

    // Clear cart
    await CartItem.destroy({ where: { cartId: cart.id } });

    const createdOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: "items", include: [{ model: Product, as: "product" }] }]
    });

    res.status(201).json({
      order: createdOrder,
      message: "Order placed successfully!"
    });
  } catch (error) { next(error); }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [['placedAt', 'DESC']],
      include: [{ model: OrderItem, as: "items", include: [{ model: Product, as: "product", attributes: ['name', 'image', 'price'] }] }]
    });
    res.json(orders);
  } catch (error) { next(error); }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: "items", include: [{ model: Product, as: "product" }] }]
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) { next(error); }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.json({ order, message: "Order status updated" });
  } catch (error) { next(error); }
};

module.exports = { placeOrder, getOrders, getOrderById, updateOrderStatus };
