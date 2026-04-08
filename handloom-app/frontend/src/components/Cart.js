import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchCart, updateCartItemAPI, removeFromCartAPI, clearCartAPI, placeOrderAPI } from "../utils/api";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) {
      setLoading(false);
      return;
    }

    const loadCart = async () => {
      try {
        const data = await fetchCart();
        setCart(data.items || []);
      } catch {
        setCart([]);
      }
      setLoading(false);
    };

    loadCart();
  }, [user]);

  const showMsg = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2000);
  };

  const updateQty = async (productId, type) => {
    const item = cart.find(item => {
      const id = item.product?._id || item.product?.id || item.product;
      return id === productId;
    });
    if (!item) return;

    const newQty = type === "inc" ? item.qty + 1 : item.qty - 1;

    try {
      if (newQty <= 0) {
        const data = await removeFromCartAPI(productId);
        setCart(data.items || []);
        showMsg("🗑️ Product removed from cart");
      } else {
        const data = await updateCartItemAPI(productId, newQty);
        setCart(data.items || []);
        showMsg(type === "inc" ? "Quantity increased" : "Quantity decreased");
      }
    } catch (err) {
      showMsg("Error: " + err.message);
    }
  };

  const removeItem = async (productId) => {
    try {
      const data = await removeFromCartAPI(productId);
      setCart(data.items || []);
      showMsg("🗑️ Product removed from cart");
    } catch (err) {
      showMsg("Error: " + err.message);
    }
  };

  const clearCart = async () => {
    try {
      await clearCartAPI();
      setCart([]);
      showMsg("Cart cleared successfully");
    } catch (err) {
      showMsg("Error: " + err.message);
    }
  };

  const handleCheckout = async () => {
    try {
      const data = await placeOrderAPI({});
      setCart([]);
      showMsg("✅ " + data.message);
    } catch (err) {
      showMsg("Error: " + err.message);
    }
  };

  const total = cart.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.qty;
  }, 0);

  if (!user) {
    return (
      <div style={{ background: "#F8F5F2", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h3>Please login to view your cart</h3>
          <button onClick={() => navigate("/login")} style={primaryBtn}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#F8F5F2", minHeight: "100vh" }}>
      <Navbar />

      <h2 style={{ textAlign: "center", marginTop: "20px" }}>🛒 Your Cart</h2>

      {loading ? (
        <p style={{ textAlign: "center", padding: "40px", color: "#888" }}>Loading cart...</p>
      ) : cart.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h3>Your cart is empty</h3>
          <p style={{ color: "gray" }}>Add some beautiful handloom products 💙</p>
        </div>
      ) : (
        <div style={{ padding: "20px" }}>

          {cart.map((item) => {
            const product = item.product || {};
            const productId = product._id || product;

            return (
              <div key={productId} style={{
                display: "flex",
                gap: "20px",
                background: "white",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "12px",
                alignItems: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}>

                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "contain",
                    borderRadius: "8px"
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h3>{product.name}</h3>
                  <p>₹{product.price}</p>

                  <div style={{ display: "flex", gap: "10px", marginTop: "10px", alignItems: "center" }}>
                    <button onClick={() => updateQty(productId, "dec")} style={qtyBtn}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(productId, "inc")} style={qtyBtn}>+</button>
                  </div>

                  <button
                    onClick={() => removeItem(productId)}
                    style={{
                      marginTop: "10px",
                      background: "none",
                      border: "none",
                      color: "red",
                      cursor: "pointer"
                    }}
                  >
                    🗑️ Remove
                  </button>
                </div>

                <h3>₹{(product.price || 0) * item.qty}</h3>
              </div>
            );
          })}

          {/* SUMMARY */}
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            textAlign: "right",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            <h2>Total: ₹{total}</h2>

            <button onClick={handleCheckout} style={{ ...primaryBtn, marginRight: "10px" }}>
              Checkout
            </button>

            <button onClick={clearCart} style={grayBtn}>
              Clear Cart
            </button>
          </div>

        </div>
      )}

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
    </div>
  );
}

const primaryBtn = {
  padding: "10px 20px",
  background: "#8B5E3C",
  color: "white",
  border: "none",
  borderRadius: "8px",
  marginTop: "10px",
  cursor: "pointer",
  fontWeight: "500"
};

const grayBtn = {
  padding: "10px 20px",
  background: "gray",
  color: "white",
  border: "none",
  borderRadius: "8px",
  marginTop: "10px",
  cursor: "pointer"
};

const qtyBtn = {
  padding: "5px 10px",
  background: "#8B5E3C",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default Cart;