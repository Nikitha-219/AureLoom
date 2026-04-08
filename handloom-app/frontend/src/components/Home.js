import Navbar from "./Navbar";
import Products from "./Products";
import banner from "../assets/banner.jpeg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { fetchProducts, addToCartAPI, updateCartItemAPI, fetchCart } from "../utils/api";

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend (fallback to hardcoded)
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data.products || []);
      } catch {
        setProducts(Products); // fallback to hardcoded
      }

      if (user?.token) {
        try {
          const cartData = await fetchCart();
          setCart(cartData.items || []);
        } catch {
          setCart([]);
        }
      }

      setLoading(false);
    };

    loadData();
  }, [user]);

  const addToCart = async (product) => {
    if (!user) { navigate("/login"); return; }

    try {
      const productId = product._id || product.id;
      const data = await addToCartAPI(productId);
      setCart(data.items || []);
    } catch (err) {
      console.error("Cart error:", err.message);
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
      console.error("Update error:", err.message);
    }
  };

  const getCartItem = (product) => {
    const productId = product._id || product.id;
    return cart.find(item => {
      const id = item.product?._id || item.product?.id || item.product;
      return id === productId;
    });
  };

  return (
    <div style={{ background: "#F8F5F2", minHeight: "100vh" }}>
      <Navbar />

      {/* BANNER */}
      <div style={{ width: "100%" }}>
        <img
          src={banner}
          alt="AureLoom Banner"
          style={{
            width: "100%",
            height: "auto",
            display: "block"
          }}
        />
      </div>

      {/* PRODUCTS */}
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

            return (
              <div key={productId} style={{ background: "white", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>

                <img
                  src={p.image}
                  alt={p.name}
                  style={{ width: "100%", height: "200px", objectFit: "contain", cursor: "pointer" }}
                  onClick={() => navigate(`/product/${productId}`)}
                />

                <h3>{p.name}</h3>
                <p style={{ color: "gray" }}>{p.shortDescription}</p>
                <p>⭐ {p.rating}</p>
                <p>₹{p.price}</p>

                {!user ? (
                  <button
                    onClick={() => navigate(`/product/${productId}`)}
                    style={btnStyle}
                  >
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

export default Home;