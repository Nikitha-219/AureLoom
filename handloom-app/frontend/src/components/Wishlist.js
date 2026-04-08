import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchWishlist, toggleWishlistAPI, addToCartAPI } from "../utils/api";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) {
      setLoading(false);
      return;
    }

    const loadWishlist = async () => {
      try {
        const data = await fetchWishlist();
        setWishlist(data.products || []);
      } catch {
        setWishlist([]);
      }
      setLoading(false);
    };

    loadWishlist();
  }, [user]);

  const showMsg = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2000);
  };

  const removeItem = async (productId) => {
    try {
      const data = await toggleWishlistAPI(productId);
      setWishlist(data.wishlist?.products || []);
      showMsg("❌ Removed from wishlist");
    } catch (err) {
      showMsg("Error: " + err.message);
    }
  };

  const addToCart = async (product) => {
    try {
      const productId = product._id || product.id;
      await addToCartAPI(productId);
      showMsg("🛍️ Added to cart!");
    } catch (err) {
      showMsg("Error: " + err.message);
    }
  };

  if (!user) {
    return (
      <div style={{ background: "#F8F5F2", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h3>Please login to view your wishlist</h3>
          <button onClick={() => navigate("/login")} style={primaryBtn}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#F8F5F2", minHeight: "100vh" }}>
      <Navbar />

      <h2 style={{ textAlign: "center", marginTop: "20px" }}>❤️ Your Wishlist</h2>

      {loading ? (
        <p style={{ textAlign: "center", padding: "40px", color: "#888" }}>Loading wishlist...</p>
      ) : wishlist.length === 0 ? (
        <h3 style={{ textAlign: "center", marginTop: "40px" }}>No items in wishlist</h3>
      ) : (
        <div style={{ padding: "20px" }}>
          {wishlist.map((item) => {
            const productId = item._id || item.id || item.product_id;

            return (
              <div key={productId} style={{
                display: "flex",
                gap: "20px",
                background: "white",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "12px",
                alignItems: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
              }}>

                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "contain"
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h3>{item.name}</h3>
                  <p style={{ color: "gray" }}>{item.shortDescription}</p>
                  <h4>₹{item.price}</h4>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button onClick={() => addToCart(item)} style={primaryBtn}>
                    Add to Cart
                  </button>
                  <button onClick={() => removeItem(productId)} style={removeBtn}>
                    Remove
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* POPUP */}
      {msg && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#333",
          color: "white",
          padding: "12px 20px",
          borderRadius: "8px",
          zIndex: 1000
        }}>
          {msg}
        </div>
      )}
    </div>
  );
}

const primaryBtn = {
  padding: "8px 12px",
  background: "#8B5E3C",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const removeBtn = {
  padding: "8px 12px",
  background: "red",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default Wishlist;