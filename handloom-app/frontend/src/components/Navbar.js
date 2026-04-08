import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 30px",
      background: "#ffffff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>

      {/* LOGO */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/869/869636.png"
          alt="logo"
          style={{ width: "35px" }}
        />
        <h2 style={{ color: "#8B5E3C" }}>Aureloom</h2>
      </div>

      {/* CENTER LINKS */}
      <div style={{
        display: "flex",
        gap: "25px",
        fontWeight: "500"
      }}>
        <Link to="/" style={{ textDecoration: "none", color: "#333" }}>Home</Link>
        <Link to="/products" style={{ textDecoration: "none", color: "#333" }}>Products</Link>
        <Link to="/artisans" style={{ textDecoration: "none", color: "#333" }}>Artisans</Link>
        <Link to="/cart" style={{ textDecoration: "none", color: "#333" }}>Cart</Link>
        <Link to="/wishlist" style={{ textDecoration: "none", color: "#333" }}>❤️</Link>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>

        {!user && (
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "6px 14px",
              background: "#8B5E3C",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Login
          </button>
        )}

        {/* PROFILE */}
        <div
          onClick={() => navigate("/profile")}
          style={{ textAlign: "center", cursor: "pointer" }}
        >
          <img
            src={
              user?.image ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="profile"
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              objectFit: "cover"
            }}
          />
          <div style={{ fontSize: "11px", color: "#555" }}>
            {user ? user.name : "Guest"}
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;