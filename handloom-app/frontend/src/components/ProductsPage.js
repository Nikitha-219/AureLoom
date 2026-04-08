import Navbar from "./Navbar";
import Products from "./Products";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchProducts, addToCartAPI, updateCartItemAPI, fetchCart, toggleWishlistAPI, fetchWishlist } from "../utils/api";

function ProductsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data.products || []);
      } catch {
        setProducts(Products);
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
  }, [user]);

  const showMsg = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2000);
  };

  const addToCart = async (product) => {
    if (!user) { navigate("/login"); return; }

    try {
      const productId = product._id || product.id;
      const data = await addToCartAPI(productId);
      setCart(data.items || []);
      showMsg("🛍️ Added to cart!");
    } catch (err) {
      showMsg("Error: " + err.message);
    }
  };

  const updateQty = async (productId, type) => {
    const item = cart.find(item => {
      const id = item.product?._id || item.product?.id || item.product;
      return id === productId;
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

  const toggleWishlist = async (product) => {
    if (!user) { navigate("/login"); return; }

    try {
      const productId = product._id || product.id;
      const data = await toggleWishlistAPI(productId);
      setWishlist(data.wishlist?.products || []);
      showMsg(data.message);
    } catch (err) {
      showMsg("Error: " + err.message);
    }
  };

  const getCartItem = (product) => {
    const productId = product._id || product.id;
    return cart.find(item => {
      const id = item.product?._id || item.product?.id || item.product;
      return id === productId;
    });
  };

  const isLiked = (product) => {
    const productId = product._id || product.id;
    return wishlist.some(item => {
      const id = item._id || item.id || item;
      return id === productId;
    });
  };

  return (
    <div style={{ background: "#F8F5F2", minHeight: "100vh" }}>
      <Navbar />

      {/* POPUP */}
      {msg && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#8B5E3C",
          color: "white",
          padding: "12px 20px",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          zIndex: 1000
        }}>
          {msg}
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: "center", padding: "40px", color: "#888" }}>Loading products...</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          padding: "20px"
        }}>
          {products.map((p) => {
            const productId = p._id || p.id;
            const inCart = getCartItem(p);
            const liked = isLiked(p);

            return (
              <div key={productId} style={{
                background: "white",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                position: "relative"
              }}>

                {/* HEART */}
                <div
                  onClick={() => toggleWishlist(p)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    fontSize: "22px",
                    cursor: "pointer"
                  }}
                >
                  {liked ? "❤️" : "🤍"}
                </div>

                <img
                  src={p.image}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "contain",
                    cursor: "pointer"
                  }}
                  onClick={() => navigate(`/product/${productId}`)}
                />

                <h3>{p.name}</h3>
                <p style={{ color: "gray" }}>{p.shortDescription}</p>
                <p>⭐ {p.rating}</p>
                <p>₹{p.price}</p>

                {!user ? (
                  <button onClick={() => navigate(`/product/${productId}`)} style={btnStyle}>
                    View
                  </button>
                ) : (
                  <>
                    {!inCart ? (
                      <button onClick={() => addToCart(p)} style={btnStyle}>
                        Add to Cart
                      </button>
                    ) : (
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <button onClick={() => updateQty(productId, "dec")} style={qtyBtn}>-</button>
                        <span>{inCart.qty}</span>
                        <button onClick={() => updateQty(productId, "inc")} style={qtyBtn}>+</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const btnStyle = {
  padding: "8px 16px",
  background: "#8B5E3C",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "500"
};

const qtyBtn = {
  padding: "5px 12px",
  background: "#8B5E3C",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default ProductsPage;