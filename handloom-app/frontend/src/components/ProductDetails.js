import { useParams } from "react-router-dom";
import Products from "./Products";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import { fetchProductById, addToCartAPI, updateCartItemAPI, fetchCart, toggleWishlistAPI, fetchWishlist } from "../utils/api";

function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch {
        // Fallback to hardcoded
        const found = Products.find((p) => p.id === parseInt(id));
        setProduct(found || null);
      }

      if (user?.token) {
        try {
          const cartData = await fetchCart();
          setCart(cartData.items || []);
        } catch { setCart([]); }

        try {
          const wishData = await fetchWishlist();
          setWishlist(wishData.products || []);
        } catch { setWishlist([]); }
      }

      setLoading(false);
    };

    loadData();
  }, [id, user]);

  const showMsg = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2000);
  };

  const addToCart = async () => {
    try {
      const productId = product._id || product.id;
      const data = await addToCartAPI(productId);
      setCart(data.items || []);
      showMsg("🛍️ Added to cart!");
    } catch (err) {
      showMsg("Error: " + err.message);
    }
  };

  const updateQty = async (type) => {
    const productId = product._id || product.id;
    const item = cart.find(item => {
      const cid = item.product?._id || item.product?.id || item.product;
      return cid === productId;
    });
    if (!item) return;

    const newQty = type === "inc" ? item.qty + 1 : item.qty - 1;

    try {
      const data = await updateCartItemAPI(productId, newQty);
      setCart(data.items || []);
    } catch (err) {
      console.error(err.message);
    }
  };

  const toggleWishlist = async () => {
    try {
      const productId = product._id || product.id;
      const data = await toggleWishlistAPI(productId);
      setWishlist(data.wishlist?.products || []);
      showMsg(data.message);
    } catch (err) {
      showMsg("Error: " + err.message);
    }
  };

  if (loading) {
    return (
      <div style={{ background: "#F8F5F2", minHeight: "100vh" }}>
        <Navbar />
        <p style={{ textAlign: "center", padding: "40px", color: "#888" }}>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ background: "#F8F5F2", minHeight: "100vh" }}>
        <Navbar />
        <h2 style={{ textAlign: "center", marginTop: "40px" }}>Product not found</h2>
      </div>
    );
  }

  const productId = product._id || product.id;
  const inCart = cart.find(item => {
    const cid = item.product?._id || item.product?.id || item.product;
    return cid === productId;
  });
  const isLiked = wishlist.some(item => {
    const wid = item._id || item.id || item;
    return wid === productId;
  });

  // Get details — handle both Map (from MongoDB) and plain object
  const details = product.details instanceof Map
    ? Object.fromEntries(product.details)
    : (product.details || {});

  return (
    <div style={{ background: "#F8F5F2", minHeight: "100vh" }}>
      <Navbar />

      {/* POPUP */}
      {msg && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#4CAF50",
          color: "white",
          padding: "12px 20px",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          zIndex: 1000
        }}>
          {msg}
        </div>
      )}

      <div style={{
        display: "flex",
        gap: "40px",
        padding: "40px"
      }}>

        {/* IMAGE */}
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "400px",
            height: "400px",
            objectFit: "cover",
            borderRadius: "10px"
          }}
        />

        {/* DETAILS */}
        <div style={{ maxWidth: "500px" }}>

          {/* WISHLIST */}
          {user && (
            <div
              onClick={toggleWishlist}
              style={{ fontSize: "30px", cursor: "pointer" }}
            >
              {isLiked ? "❤️" : "🤍"}
            </div>
          )}

          <h2>{product.name}</h2>
          <p>⭐ {product.rating}</p>
          <h3>₹{product.price}</h3>

          <p>{product.description}</p>

          {/* PRODUCT DETAILS TABLE */}
          <h3 style={{ marginTop: "20px" }}>Product Details</h3>

          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "10px"
          }}>
            {Object.entries(details).map(([key, value]) => (
              <div key={key} style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                padding: "6px 0"
              }}>
                <div style={{ fontWeight: "bold" }}>{key}</div>
                <div style={{ textAlign: "left" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* CART SECTION */}
          {user && (
            <div style={{ marginTop: "20px" }}>
              {!inCart ? (
                <button onClick={addToCart} style={btnStyle}>
                  Add to Cart
                </button>
              ) : (
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <button onClick={() => updateQty("dec")} style={qtyBtn}>-</button>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>{inCart.qty}</span>
                  <button onClick={() => updateQty("inc")} style={qtyBtn}>+</button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const btnStyle = {
  padding: "10px 20px",
  background: "#8B5E3C",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "16px"
};

const qtyBtn = {
  padding: "8px 14px",
  background: "#8B5E3C",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default ProductDetails;