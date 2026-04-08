const { sequelize, User, Product, Cart } = require("./models");
const authController = require("./controllers/cartController");

const testCart = async () => {
  try {
    await sequelize.authenticate();
    
    // Find first user and first product
    const user = await User.findOne();
    const product = await Product.findOne();

    if (!user || !product) {
        console.log("Missing user or product in DB");
        process.exit();
    }

    // Mock Express Request and Response
    const req = {
        user: { id: user.id },
        body: { productId: product.id, qty: 1 }
    };
    
    const res = {
        json: (data) => console.log("SUCCESS:", JSON.stringify(data, null, 2)),
        status: (code) => {
            console.log("STATUS:", code);
            return res;
        }
    };
    
    const next = (err) => {
        console.error("EXPRESS ERROR CAUGHT:");
        console.error(err);
    };

    console.log("Testing addToCart...");
    await authController.addToCart(req, res, next);
    
    console.log("Testing getWishlist...");
    const reqWish = { user: { id: user.id }, params: { productId: product.id } };
    const wishController = require("./controllers/wishlistController");
    await wishController.toggleWishlist(reqWish, res, next);

  } catch (err) {
    console.error("FATAL ERROR:", err);
  } finally {
      process.exit();
  }
};

testCart();
