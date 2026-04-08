const { Artisan, User, Product } = require("../models");

const getArtisans = async (req, res, next) => {
  try {
    const artisans = await Artisan.findAll({
      include: [{ model: User, attributes: ['name', 'email'] }]
    });
    res.json(artisans);
  } catch (error) { next(error); }
};

const getArtisanById = async (req, res, next) => {
  try {
    const artisan = await Artisan.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: Product } // associations from index.js
      ]
    });

    if (!artisan) return res.status(404).json({ message: "Artisan not found" });
    res.json(artisan);
  } catch (error) { next(error); }
};

const updateArtisan = async (req, res, next) => {
  try {
    const artisan = await Artisan.findByPk(req.params.id);
    if (!artisan) return res.status(404).json({ message: "Artisan not found" });

    await artisan.update(req.body);
    res.json(artisan);
  } catch (error) { next(error); }
};

const createArtisan = async (req, res, next) => {
  try {
    const { name, location, speciality, about, image } = req.body;
    const artisan = await Artisan.create({
      userId: req.user.id,
      name: name || req.user.name,
      location,
      speciality,
      about,
      image: image || req.user.image
    });
    res.status(201).json(artisan);
  } catch (error) { next(error); }
};

module.exports = { getArtisans, getArtisanById, updateArtisan, createArtisan };
