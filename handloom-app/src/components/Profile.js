import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <h2>Please login</h2>;
  }

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>Profile</h2>

        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Phone:</b> {user.phone}</p>
        <p><b>Role:</b> {user.role}</p>

        <h3>Orders</h3>
        <ul>
          <li>Order #123 - Delivered</li>
          <li>Order #456 - In Transit</li>
        </ul>

        <h3>Wishlist</h3>
        <p>View your saved products ❤️</p>

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Profile;