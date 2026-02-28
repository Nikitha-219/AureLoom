import { useParams } from "react-router-dom";
import Products from "./Products"; 
import { useState } from "react";
import Navbar from "./Navbar";

function ProductDetails() {
  const { id } = useParams();
  const product = Products.find((p) => p.id === parseInt(id));

  const [msg, setMsg] = useState(""); // ✅ ADDED

  // CART FUNCTIONS
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

    // ✅ POPUP MESSAGE ADDED
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
    window.location.reload(); // (kept as it is since you said minimal changes)
  };

  const cart = getCart();
  const inCart = cart.find(item => item.id === product?.id);

  // WISHLIST
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const isLiked = wishlist.find(p => p.id === product?.id);

  const toggleWishlist = () => {
    let updated;

    if (isLiked) {
      updated = wishlist.filter(p => p.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }

    localStorage.setItem("wishlist", JSON.stringify(updated));
    window.location.reload();
  };

  if (!product) {
    return <h2 style={{ textAlign: "center" }}>Product not found</h2>;
  }

  return (
    <div style={{ background: "#F8F5F2", minHeight: "100vh" }}>
      <Navbar />

      {/* ✅ POPUP ADDED */}
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

          {/* ❤️ Wishlist */}
          <div
            onClick={toggleWishlist}
            style={{ fontSize: "30px", cursor: "pointer" }}
          >
            {isLiked ? "❤️" : "🤍"}
          </div>

          <h2>{product.name}</h2>
          <p>⭐ {product.rating}</p>
          <h3>₹{product.price}</h3>

          {/* DESCRIPTION */}
          <p>{product.description}</p>

          {/* 🧵 PRODUCT DETAILS TABLE */}
          <h3 style={{ marginTop: "20px" }}>Product Details</h3>

          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "10px"
          }}>
            {product.details &&
              Object.entries(product.details).map(([key, value]) => (
                <div key={key} style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  padding: "6px 0"
                }}>
                  <div style={{ fontWeight: "bold" }}>{key}</div>
                  <div style={{ textAlign: "left" }}>{value}</div>
                </div>
              ))
            }
          </div>

          {/* 🛒 CART SECTION */}
          <div style={{ marginTop: "20px" }}>
            {!inCart ? (
              <button onClick={() => addToCart(product)}>
                Add to Cart
              </button>
            ) : (
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => updateQty(product.id, "dec")}>-</button>
                <span>{inCart.qty}</span>
                <button onClick={() => updateQty(product.id, "inc")}>+</button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;