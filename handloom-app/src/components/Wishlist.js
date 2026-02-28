import Navbar from "./Navbar";

function Wishlist() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  return (
    <div>
      <Navbar />
      <h2 style={{ textAlign: "center" }}>Wishlist ❤️</h2>

      {wishlist.length === 0 ? (
        <p style={{ textAlign: "center" }}>No items yet</p>
      ) : (
        wishlist.map((item) => (
          <div key={item.id} style={{ textAlign: "center", margin: "20px" }}>
            <img src={item.image} width="200" alt="" />
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Wishlist;