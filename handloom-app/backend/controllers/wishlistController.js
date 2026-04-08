const { Wishlist, Product } = require("../models");

const getWishlist = async (req, res, next) => {
  try {
    let [wishlist] = await Wishlist.findOrCreate({ where: { userId: req.user.id } });

    wishlist = await Wishlist.findByPk(wishlist.id, {
      include: [{ model: Product, as: "products" }]
    });

    res.json(wishlist);
  } catch (error) { next(error); }
};

const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let [wishlist] = await Wishlist.findOrCreate({ where: { userId: req.user.id } });

    // Check if the product is already in the wishlist. 
    // Sequelize M2M provides "hasProduct", "addProduct", "removeProduct" methods
    const hasProduct = await wishlist.hasProduct(productId);
    let action;

    if (hasProduct) {
      await wishlist.removeProduct(productId);
      action = "removed";
    } else {
      await wishlist.addProduct(productId);
      action = "added";
    }

    wishlist = await Wishlist.findByPk(wishlist.id, {
      include: [{ model: Product, as: "products" }]
    });

    res.json({
      wishlist,
      action,
      message: action === "added" ? "Added to wishlist" : "Removed from wishlist"
    });
  } catch (error) { next(error); }
};

module.exports = { getWishlist, toggleWishlist };
