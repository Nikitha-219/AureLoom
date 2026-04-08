const { Product, Artisan, Review } = require("../models");
const { Op } = require("sequelize");

const getProducts = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

    let whereClause = {};

    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { shortDescription: { [Op.like]: `%${search}%` } }
        ]
      };
    }
    if (category) whereClause.category = category;
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = Number(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = Number(maxPrice);
    }

    let orderClause = [['createdAt', 'DESC']];
    if (sort === "price_asc") orderClause = [['price', 'ASC']];
    else if (sort === "price_desc") orderClause = [['price', 'DESC']];
    else if (sort === "rating") orderClause = [['rating', 'DESC']];

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      order: orderClause,
      limit: Number(limit),
      offset,
      include: [{ model: Artisan, attributes: ['id', 'name', 'location'] }]
    });

    res.json({
      products,
      page: Number(page),
      totalPages: Math.ceil(count / Number(limit)),
      totalProducts: count
    });
  } catch (error) { next(error); }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Artisan, attributes: ['id', 'name', 'location', 'image'] }]
    });

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) { next(error); }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) { next(error); }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.update(req.body);
    res.json(product);
  } catch (error) { next(error); }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  } catch (error) { next(error); }
};

const getByCategory = async (req, res, next) => {
  try {
    const products = await Product.findAll({ where: { category: req.params.category } });
    res.json(products);
  } catch (error) { next(error); }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getByCategory };
