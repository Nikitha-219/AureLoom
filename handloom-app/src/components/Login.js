import { useState } from "react";
import { useNavigate } from "react-router-dom";
 

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "buyer"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    localStorage.setItem("user", JSON.stringify(form));
    navigate("/");
  };

  return (
    <div style={{
      height: "100vh",
     backgroundImage: "url('https://i.pinimg.com/736x/08/3f/d9/083fd9ff3cbffa9f1c1791d77578ed3c.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative"
    }}>

      {/* 🌫️ LIGHT OVERLAY */}
      <div style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.3)"  // 👈 light overlay only
      }} />

      {/* 🔐 LOGIN CARD */}
      <div style={{
        position: "relative",
        width: "360px",
        padding: "30px",
        borderRadius: "15px",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        textAlign: "center"
      }}>

        <h2 style={{
          marginBottom: "20px",
          color: "#6D4C41",   // 👈 elegant brown
          fontWeight: "600"
        }}>
          Welcome to Aureloom
        </h2>

        <input name="name" placeholder="Full Name" onChange={handleChange} style={inputStyle} />
        <input name="email" placeholder="Email Address" onChange={handleChange} style={inputStyle} />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} style={inputStyle} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} style={inputStyle} />

        <select name="role" onChange={handleChange} style={inputStyle}>
          <option value="buyer">Buyer</option>
          <option value="artisan">Artisan</option>
        </select>

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "12px",
            background: "#6D4C41",
            color: "white",
            border: "none",
            borderRadius: "8px",
            marginTop: "10px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Login
        </button>

      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0",
  borderRadius: "8px",
  border: "1px solid #ddd",
  outline: "none"
};

export default Login;