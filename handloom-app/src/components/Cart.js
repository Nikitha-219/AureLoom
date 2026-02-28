import Navbar from "./Navbar";
import { useState, useEffect } from "react";

function Cart() {
  const [cart, setCart] = useState([]);
  const [msg, setMsg] = useState("");

  const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];

  useEffect(() => {
    setCart(getCart());
  }, []);

  // 🔄 UPDATE QUANTITY
  const updateQty = (id, type) => {
    let updatedCart = getCart();

    updatedCart = updatedCart
      .map((p) => {
        if (p.id === id) {
          if (type === "inc") {
            setMsg("➕ Product quantity increased");
            return { ...p, qty: p.qty + 1 };
          }
          if (type === "dec") {
            if (p.qty === 1) {
              setMsg("🗑️ Product removed from cart");
              return null;
            }
            setMsg("➖ Product quantity decreased");
            return { ...p, qty: p.qty - 1 };
          }
        }
        return p;
      })
      .filter(Boolean);

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);

    setTimeout(() => setMsg(""), 2000);
  };

  // 🗑️ REMOVE ITEM
  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);

    setMsg("🗑️ Product removed from cart");
    setTimeout(() => setMsg(""), 2000);
  };

  // 🧹 CLEAR CART
  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);

    setMsg("🧹 Cart cleared successfully");
    setTimeout(() => setMsg(""), 2000);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div style={{ background: "#F8F5F2", minHeight: "100vh" }}>
      <Navbar />

      <h2 style={{ textAlign: "center", marginTop: "20px" }}>
        🛒 Your Cart
      </h2>

      {cart.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h3>Your cart is empty</h3>
          <p style={{ color: "gray" }}>
            Add some beautiful handloom products 💙
          </p>
        </div>
      ) : (
        <div style={{ padding: "20px" }}>

          {/* 🛍️ ITEMS */}
          {cart.map((item) => (
            <div key={item.id} style={{
              display: "flex",
              gap: "20px",
              background: "white",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "12px",
              alignItems: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>

              {/* IMAGE */}
              <img
                src={item.image}
                alt=""
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "contain",
                  borderRadius: "8px"
                }}
              />

              {/* DETAILS */}
              <div style={{ flex: 1 }}>
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>

                {/* QUANTITY */}
                <div style={{ display: "flex", gap: "10px", marginTop: "10px", alignItems: "center" }}>
                  <button
                    onClick={() => updateQty(item.id, "dec")}
                    style={{ padding: "5px 10px" }}
                  >
                    -
                  </button>

                  <span>{item.qty}</span>

                  <button
                    onClick={() => updateQty(item.id, "inc")}
                    style={{ padding: "5px 10px" }}
                  >
                    +
                  </button>
                </div>

                {/* REMOVE */}
                <button
                  onClick={() => removeItem(item.id)}
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

              {/* TOTAL PER ITEM */}
              <h3>₹{item.price * item.qty}</h3>

            </div>
          ))}

          {/* 💰 SUMMARY */}
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            textAlign: "right",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            <h2>Total: ₹{total}</h2>

            <button style={{
              padding: "10px 20px",
              background: "#8B5E3C",
              color: "white",
              border: "none",
              borderRadius: "8px",
              marginTop: "10px",
              marginRight: "10px",
              cursor: "pointer"
            }}>
              Checkout
            </button>

            <button
              onClick={clearCart}
              style={{
                padding: "10px 20px",
                background: "gray",
                color: "white",
                border: "none",
                borderRadius: "8px",
                marginTop: "10px",
                cursor: "pointer"
              }}
            >
              Clear Cart
            </button>
          </div>

        </div>
      )}

      {/* 🔥 POPUP MESSAGE */}
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

    </div>
  );
}
export default Cart;