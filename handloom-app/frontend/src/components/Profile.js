import Navbar from "./Navbar";
import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfileAPI, fetchOrders, fetchWishlist } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });
  const [image, setImage] = useState(user?.image || "");
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [msg, setMsg] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    if (!user?.token) return;

    const loadData = async () => {
      try {
        const orderData = await fetchOrders();
        setOrders(orderData || []);
      } catch { setOrders([]); }

      try {
        const wishData = await fetchWishlist();
        setWishlist(wishData.products || []);
      } catch { setWishlist([]); }
    };

    loadData();
  }, [user]);

  const showMsg = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2000);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const updatedData = { ...form, image };
      const data = await updateProfileAPI(updatedData);
      updateUser(data);
      showMsg("✅ Profile updated!");
      setEdit(false);
    } catch (err) {
      showMsg("Error: " + err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <Navbar />
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h3>Please login to view your profile</h3>
          <button onClick={() => navigate("/login")} style={{ ...styles.button, background: "#8B5E3C", color: "white" }}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar />

      {/* POPUP */}
      {msg && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#4CAF50",
          color: "white",
          padding: "12px 20px",
          borderRadius: "8px",
          zIndex: 1000
        }}>
          {msg}
        </div>
      )}

      <div style={styles.card}>

        {/* PROFILE HEADER */}
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>

          {/* PROFILE IMAGE */}
          <div style={{ position: "relative", width: "100px" }}>
            <img
              src={image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt="profile"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #8B5E3C"
              }}
            />

            <div
              onClick={() => fileInputRef.current.click()}
              style={{
                position: "absolute",
                bottom: "5px",
                right: "5px",
                background: "#8B5E3C",
                borderRadius: "50%",
                padding: "8px",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
              }}
            >
              📷
            </div>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImage}
            />
          </div>

          <div>
            <h2>{user.name || "Guest"}</h2>
            <p style={{ color: "gray" }}>{user.email}</p>
          </div>
        </div>

        {/* EDIT PROFILE */}
        <div style={styles.section}>
          <h3>Profile Details</h3>

          {edit ? (
            <>
              <input
                style={styles.input}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
              />
              <input
                style={styles.input}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
              />
              <input
                style={styles.input}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone"
              />

              <button
                style={{ ...styles.button, background: "#4CAF50", color: "white" }}
                onClick={handleSave}
              >
                Save
              </button>
              <button
                style={{ ...styles.button, background: "#999", color: "white", marginLeft: "10px" }}
                onClick={() => setEdit(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <p><b>Name:</b> {user.name}</p>
              <p><b>Email:</b> {user.email}</p>
              <p><b>Phone:</b> {user.phone}</p>
              <p><b>Role:</b> {user.role}</p>

              <button
                style={{ ...styles.button, background: "#8B5E3C", color: "white" }}
                onClick={() => setEdit(true)}
              >
                Edit Profile
              </button>
            </>
          )}
        </div>

        {/* ORDERS */}
        <div style={styles.section}>
          <h3>📦 Orders</h3>

          {orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} style={{
                background: "#fafafa",
                padding: "15px",
                borderRadius: "8px",
                marginTop: "10px"
              }}>
                <p><b>Order ID:</b> {order._id}</p>
                <p><b>Status:</b> <span style={{
                  color: order.orderStatus === "delivered" ? "green" : "#E65100",
                  fontWeight: "bold"
                }}>{order.orderStatus}</span></p>
                <p><b>Items:</b> {order.items?.length || 0}</p>
                <p><b>Total:</b> ₹{order.totalPrice}</p>
                <p><b>Placed:</b> {new Date(order.placedAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>

        {/* WISHLIST */}
        <div style={styles.section}>
          <h3>❤️ Wishlist</h3>

          {wishlist.length === 0 ? (
            <p>No items in wishlist</p>
          ) : (
            wishlist.map((item) => (
              <div key={item._id || item.id} style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
                alignItems: "center"
              }}>
                <img src={item.image} alt={item.name} width="60" style={{ borderRadius: "6px" }} />
                <div>
                  <p style={{ fontWeight: "bold" }}>{item.name}</p>
                  <p style={{ color: "#8B5E3C" }}>₹{item.price}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* LOGOUT */}
        <button
          style={{ ...styles.button, background: "red", color: "white", marginTop: "20px" }}
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#F8F5F2",
    minHeight: "100vh",
    padding: "30px"
  },
  card: {
    maxWidth: "900px",
    margin: "auto",
    background: "white",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },
  section: {
    marginTop: "25px"
  },
  input: {
    padding: "8px",
    margin: "5px 0",
    width: "100%",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px 15px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer"
  }
};

export default Profile;