const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/../.env" });

const { sequelize, Product, Artisan, User } = require("../models");
const bcrypt = require("bcryptjs");

const productsData = require("./products.json");
const artisansData = require("./artisans.json");

const seedDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Connected for seeding");

    // Sync all defined models to the DB and force recreate tables
    await sequelize.sync({ force: true });
    console.log("🗑️  Tables synced and recreated");

    // 1. Create a default Artisan User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const defaultUser = await User.create({
      name: "Admin Artisan",
      email: "artisan@aureloom.com",
      phone: "1234567890",
      password: hashedPassword, // explicitly hash since hook might not run in bulkCreate based on setup
      role: "artisan",
    });

    console.log(`🧑‍💻 Created default artisan user.`);

    // 2. Insert Artisans
    const artisanDocs = artisansData.map(artisan => ({
      ...artisan,
      userId: defaultUser.id
    }));
    const insertedArtisans = await Artisan.bulkCreate(artisanDocs, { returning: true });
    console.log(`🧑‍🎨 ${insertedArtisans.length} artisans seeded`);

    // 3. Insert Products and assign to artisans sequentially
    const productDocs = productsData.map((product, index) => ({
      ...product,
      artisanId: insertedArtisans[index % insertedArtisans.length].id
    }));

    const insertedProducts = await Product.bulkCreate(productDocs);
    console.log(`📦 ${insertedProducts.length} products seeded`);

    console.log("\n✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
