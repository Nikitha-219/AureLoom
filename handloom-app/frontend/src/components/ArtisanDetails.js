import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import Products from "./Products";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchArtisanById, addToCartAPI } from "../utils/api";

const fallbackArtisans = [
  { id: 1, name: "Anita Devi", location: "Bhuj, Gujarat", speciality: "Bandhani & Ajrakh Printing", rating: 4.9, image: "https://randomuser.me/api/portraits/women/65.jpg", about: "Renowned for her intricate bandhani work and ajrakh printing." },
  { id: 2, name: "Priya Sharma", location: "Varanasi, Uttar Pradesh", speciality: "Silk Weaving & Traditional Sarees", rating: 4.8, image: "https://randomuser.me/api/portraits/women/44.jpg", about: "Third-generation weaver specializing in traditional silk sarees." },
  { id: 3, name: "Rajesh Kumar", location: "Jaipur, Rajasthan", speciality: "Block Printing & Natural Dyes", rating: 4.7, image: "https://randomuser.me/api/portraits/men/32.jpg", about: "Master artisan in block printing using eco-friendly dyes." },
  { id: 4, name: "Suresh Patel", location: "Surat, Gujarat", speciality: "Handloom Cotton Fabrics", rating: 4.6, image: "https://randomuser.me/api/portraits/men/45.jpg", about: "Expert in weaving breathable cotton fabrics." },
  { id: 5, name: "Lakshmi Devi", location: "Kanchipuram, Tamil Nadu", speciality: "Kanchipuram Silk Sarees", rating: 4.9, image: "https://randomuser.me/api/portraits/women/68.jpg", about: "Specialist in luxurious silk sarees with rich zari work." },
  { id: 6, name: "Arjun Reddy", location: "Hyderabad, Telangana", speciality: "Ikat & Handwoven Textiles", rating: 4.7, image: "https://randomuser.me/api/portraits/men/52.jpg", about: "Passionate artisan known for vibrant ikat designs." }
];

function ArtisanDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [artisan, setArtisan] = useState(null);
  const [artisanProducts, setArtisanProducts] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtisan = async () => {
      try {
        const data = await fetchArtisanById(id);
        setArtisan(data);
        setArtisanProducts(data.products || []);
      } catch {
        // Fallback to hardcoded
        const found = fallbackArtisans.find(a => a.id === parseInt(id));
        setArtisan(found || null);
        setArtisanProducts(Products.slice(0, 3));
      }
      setLoading(false);
    };

    loadArtisan();
  }, [id]);

  const showMsg = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2000);
  };

  const addToCart = async (product) => {
    if (!user) return;

    try {
      const productId = product._id || product.id;
      await addToCartAPI(productId);
      showMsg("🛍️ Product added to cart");
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

  if (!artisan) {
    return (
      <div style={{ background: "#F8F5F2", minHeight: "100vh" }}>
        <Navbar />
        <h2 style={{ textAlign: "center", marginTop: "40px" }}>Artisan not found</h2>
      </div>
    );
  }

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
          padding: "10px 20px",
          borderRadius: "8px",
          zIndex: 1000
        }}>
          {msg}
        </div>
      )}

      {/* PROFILE */}
      <div style={{ display: "flex", gap: "40px", padding: "40px" }}>
        <img
          src={artisan.image}
          alt={artisan.name}
          style={{ width: "300px", borderRadius: "15px" }}
        />

        <div>
          <h1>{artisan.name}</h1>
          <p>📍 {artisan.location}</p>

          <div style={{
            background: "#EFE3D3",
            padding: "10px 15px",
            borderRadius: "20px",
            display: "inline-block",
            margin: "10px 0",
            color: "#8B5E3C"
          }}>
            🏅 {artisan.speciality}
          </div>

          <h3>About</h3>
          <p>{artisan.about || artisan.description}</p>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: "flex", gap: "20px", padding: "0 40px" }}>
        <div style={{ flex: 1, background: "#EEE", padding: "20px", textAlign: "center", borderRadius: "10px" }}>
          <h2>{artisanProducts.length || artisan.products?.length || 0}</h2>
          <p>Products</p>
        </div>

        <div style={{ flex: 1, background: "#EEE", padding: "20px", textAlign: "center", borderRadius: "10px" }}>
          <h2>{artisan.rating}</h2>
          <p>Average Rating</p>
        </div>
      </div>

      {/* PRODUCTS */}
      <h2 style={{ padding: "40px 40px 0" }}>Products by {artisan.name}</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
        padding: "20px 40px 40px"
      }}>
        {artisanProducts.map((p) => {
          const productId = p._id || p.id;

          return (
            <div key={productId} style={{ background: "white", borderRadius: "15px", overflow: "hidden" }}>

              <img
                src={p.image}
                alt={p.name}
                style={{ width: "100%", height: "300px", objectFit: "cover" }}
              />

              <div style={{ padding: "15px" }}>
                <p>⭐ {p.rating}</p>
                <h3>{p.name}</h3>
                <p>{p.shortDescription}</p>
                <h2 style={{ color: "#8B5E3C" }}>₹{p.price}</h2>

                {user && (
                  <button
                    onClick={() => addToCart(p)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "#8B5E3C",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  >
                    Add to Cart
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ArtisanDetails;