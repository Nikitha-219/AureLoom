const { Review, Product, User } = require("../models");

const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    const existingReview = await Review.findOne({
      where: { userId: req.user.id, productId }
    });

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    const review = await Review.create({
      userId: req.user.id,
      productId,
      rating,
      comment
    });

    // Update product rating
    const reviews = await Review.findAll({ where: { productId } });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.update(
      { rating: Math.round(avgRating * 10) / 10, numReviews: reviews.length },
      { where: { id: productId } }
    );

    res.status(201).json(review);
  } catch (error) { next(error); }
};

const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { productId: req.params.productId },
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['name', 'image'] }]
    });

    res.json(reviews);
  } catch (error) { next(error); }
};

module.exports = { addReview, getProductReviews };
