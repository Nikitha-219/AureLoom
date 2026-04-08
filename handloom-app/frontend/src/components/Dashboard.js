import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { fetchProducts, fetchOrders } from "../utils/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const prodData = await fetchProducts();
        setProducts(prodData.products || []);
      } catch { setProducts([]); }

      try {
        const orderData = await fetchOrders();
        setOrders(orderData || []);
      } catch { setOrders([]); }

      setLoading(false);
    };

    loadData();
  }, [user]);

  if (!user) {
    return (
      <div style={styles.container}>
        <Navbar />
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h3>Please login to access the dashboard</h3>
          <button onClick={() => navigate("/login")} style={styles.button}>Login</button>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  return (
    <div style={styles.container}>
      <Navbar />

      <h2 style={{ padding: "20px 30px 0", color: "#8B5E3C" }}>📊 Dashboard</h2>
      <p style={{ padding: "0 30px", color: "#666" }}>Welcome back, {user.name}!</p>

      {loading ? (
        <p style={{ textAlign: "center", padding: "40px", color: "#888" }}>Loading...</p>
      ) : (
        <>
          {/* STATS */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            padding: "20px 30px"
          }}>
            <div style={styles.statCard}>
              <h1 style={{ color: "#8B5E3C" }}>{products.length}</h1>
              <p>Total Products</p>
            </div>
            <div style={styles.statCard}>
              <h1 style={{ color: "#8B5E3C" }}>{orders.length}</h1>
              <p>Total Orders</p>
            </div>
            <div style={styles.statCard}>
              <h1 style={{ color: "#8B5E3C" }}>₹{totalRevenue}</h1>
              <p>Total Revenue</p>
            </div>
          </div>

          {/* RECENT ORDERS */}
          <div style={{ padding: "0 30px 30px" }}>
            <h3>Recent Orders</h3>
            {orders.length === 0 ? (
              <p style={{ color: "#888" }}>No orders yet</p>
            ) : (
              orders.slice(0, 5).map((order) => (
                <div key={order._id} style={styles.orderCard}>
                  <div>
                    <p><b>Order:</b> {order._id?.slice(-8)}</p>
                    <p><b>Items:</b> {order.items?.length || 0}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: "bold", color: "#8B5E3C" }}>₹{order.totalPrice}</p>
                    <p style={{
                      color: order.orderStatus === "delivered" ? "green" : "#E65100",
                      fontWeight: "500"
                    }}>
                      {order.orderStatus}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: "#F8F5F2",
    minHeight: "100vh"
  },
  button: {
    background: "#8B5E3C",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer"
  },
  statCard: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
  },
  orderCard: {
    display: "flex",
    justifyContent: "space-between",
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    marginTop: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
  }
};

export default Dashboard;