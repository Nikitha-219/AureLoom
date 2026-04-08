import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchArtisans } from "../utils/api";

const fallbackArtisans = [
  {
    id: 1, name: "Anita Devi", location: "Bhuj, Gujarat",
    speciality: "Bandhani & Ajrakh Printing", rating: 4.9, products: 19,
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    about: "Renowned for her intricate bandhani work and ajrakh printing."
  },
  {
    id: 2, name: "Priya Sharma", location: "Varanasi, Uttar Pradesh",
    speciality: "Silk Weaving & Traditional Sarees", rating: 4.8, products: 24,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    about: "Third-generation weaver specializing in traditional silk sarees."
  },
  {
    id: 3, name: "Rajesh Kumar", location: "Jaipur, Rajasthan",
    speciality: "Block Printing & Natural Dyes", rating: 4.7, products: 31,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    about: "Master artisan in block printing using eco-friendly dyes."
  },
  {
    id: 4, name: "Suresh Patel", location: "Surat, Gujarat",
    speciality: "Handloom Cotton Fabrics", rating: 4.6, products: 22,
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    about: "Expert in weaving breathable cotton fabrics."
  },
  {
    id: 5, name: "Lakshmi Devi", location: "Kanchipuram, Tamil Nadu",
    speciality: "Kanchipuram Silk Sarees", rating: 4.9, products: 28,
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    about: "Specialist in luxurious silk sarees with rich zari work."
  },
  {
    id: 6, name: "Arjun Reddy", location: "Hyderabad, Telangana",
    speciality: "Ikat & Handwoven Textiles", rating: 4.7, products: 20,
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    about: "Passionate artisan known for vibrant ikat designs."
  }
];

function Artisans() {
  const navigate = useNavigate();
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtisans = async () => {
      try {
        const data = await fetchArtisans();
        setArtisans(data);
      } catch {
        setArtisans(fallbackArtisans);
      }
      setLoading(false);
    };

    loadArtisans();
  }, []);

  return (
    <div style={{ background: "#F8F5F2", minHeight: "100vh" }}>
      <Navbar />

      {loading ? (
        <p style={{ textAlign: "center", padding: "40px", color: "#888" }}>Loading artisans...</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "25px",
          padding: "30px"
        }}>
          {artisans.map((a) => {
            const artisanId = a._id || a.id;

            return (
              <div key={artisanId} style={{
                background: "white",
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
              }}>

                <img
                  src={a.image}
                  alt={a.name}
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover"
                  }}
                />

                <div style={{ padding: "20px" }}>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <h2 style={{ margin: 0 }}>{a.name}</h2>
                    <span style={{ fontWeight: "bold" }}>⭐ {a.rating}</span>
                  </div>

                  <p style={{ color: "#666", margin: "5px 0" }}>📍 {a.location}</p>

                  <div style={{
                    background: "#EFE3D3",
                    padding: "10px 15px",
                    borderRadius: "20px",
                    display: "inline-block",
                    margin: "10px 0",
                    color: "#8B5E3C",
                    fontWeight: "500"
                  }}>
                    {a.speciality}
                  </div>

                  <p style={{ color: "#444", lineHeight: "1.5" }}>
                    {a.about || a.description}
                  </p>

                  <p style={{ marginTop: "10px", color: "#555" }}>
                    📦 {a.products?.length || a.products || 0} products
                  </p>

                  <button
                    onClick={() => navigate(`/artisan/${artisanId}`)}
                    style={{
                      width: "100%",
                      marginTop: "15px",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid #8B5E3C",
                      background: "white",
                      color: "#8B5E3C",
                      fontWeight: "500",
                      cursor: "pointer"
                    }}
                  >
                    View Profile
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Artisans;