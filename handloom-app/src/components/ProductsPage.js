import Navbar from "./Navbar";
import Products from "./Products";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ProductsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [msg, setMsg] = useState("");

  const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];

  const addToCart = (product) => {
    let cart = getCart();

    const exist = cart.find(p => p.id === product.id);

    if (exist) {
      cart = cart.map(p =>
        p.id === product.id ? { ...p, qty: p.qty + 1 } : p
      );
    } else {
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // ✅ POPUP MESSAGE
    setMsg("🛍️ This product has been added to your cart");
    setTimeout(() => setMsg(""), 2000);
  };

  const updateQty = (id, type) => {
    let cart = getCart();

    cart = cart
      .map(p => {
        if (p.id === id) {
          if (type === "inc") return { ...p, qty: p.qty + 1 };
          if (type === "dec") {
            if (p.qty === 1) return null;
            return { ...p, qty: p.qty - 1 };
          }
        }
        return p;
      })
      .filter(Boolean);

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const cart = getCart();

  return (
    <div style={{ background: "#F8F5F2", minHeight: "100vh" }}>
      <Navbar />

      {/* 🔥 POPUP */}
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

      {/* 🛍️ PRODUCTS GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
        padding: "20px"
      }}>
        {Products.map((p) => {
          const inCart = cart.find(item => item.id === p.id);

          return (
            <div key={p.id} style={{
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>

              <img
                src={p.image}
                alt=""
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "contain",
                  cursor: "pointer"
                }}
                onClick={() => navigate(`/product/${p.id}`)}
              />

              <h3>{p.name}</h3>
              <p style={{ color: "gray" }}>{p.shortDescription}</p>
              <p>⭐ {p.rating}</p>
              <p>₹{p.price}</p>

              {!user ? (
                <button onClick={() => navigate(`/product/${p.id}`)}>
                  View
                </button>
              ) : (
                <>
                  {!inCart ? (
                    <button onClick={() => addToCart(p)}>
                      Add to Cart
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => updateQty(p.id, "dec")}>-</button>
                      <span>{inCart.qty}</span>
                      <button onClick={() => updateQty(p.id, "inc")}>+</button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductsPage;