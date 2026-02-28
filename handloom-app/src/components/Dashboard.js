import Navbar from "./Navbar";

function Dashboard() {
  const styles = {
    container: {
      background: "#F8F5F2",
      height: "100vh",
      padding: "20px"
    },
    card: {
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    },
    button: {
      background: "#8B5E3C",
      color: "white",
      padding: "10px",
      borderRadius: "8px",
      border: "none"
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.card}>
        <h2>Dashboard</h2>
        <button style={styles.button}>Add Product</button>
        <p>Manage your products easily</p>
      </div>
    </div>
  );
}

export default Dashboard;