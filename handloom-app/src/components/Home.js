import Navbar from "./Navbar";
import Products from "./Products";
import banner from "../assets/banner.jpeg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];
  const [showMsg, setShowMsg] = useState(false);

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
    window.location.reload();
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
    window.location.reload();
  };

  const cart = getCart();

  return (
    <div style={{ background: "#F8F5F2", minHeight: "100vh" }}>
      <Navbar />

      {/* 🔥 BANNER */}
     <div style={{ width: "100%" }}>

  {/* 🔥 FULL IMAGE */}
  <img
    src={banner}
    alt="banner"
    style={{
      width: "100%",
      height: "auto",
      display: "block"
    }}
  />

  {/* 🔹 TEXT OVER IMAGE */}
  <div style={{
    position: "absolute",
    top: "20%",
    width: "100%",
    textAlign: "center",
    color: "white"
  }}>
  </div>
  </div>

      {/* 🛍️ PRODUCTS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
        padding: "20px"
      }}>
        {Products.map((p) => {
          const inCart = cart.find(item => item.id === p.id);

          return (
            <div key={p.id} style={{ background: "white", padding: "15px" }}>

              <img
                src={p.image}
                alt=""
                style={{ width: "100%", height: "200px", objectFit: "contain", cursor: "pointer" }}
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
                    <button onClick={() => addToCart(p)}>Add to Cart</button>
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

export default Home;