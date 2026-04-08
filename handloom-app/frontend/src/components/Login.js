import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser, loginUser, verifyRegisterOtpAPI } from "../utils/api";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(false);
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [debugOtp, setDebugOtp] = useState(null);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "buyer"
  });
  
  const [otpForm, setOtpForm] = useState({
    emailOtp: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtpForm({ ...otpForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");

    if (!isLogin && (!form.name || !form.email || !form.password)) {
      setError("Please fill all required fields");
      return;
    }

    if (isLogin && (!form.email || !form.password)) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Direct logic for login
        const userData = await loginUser(form.email, form.password);
        login(userData);
        navigate("/");
      } else {
        // Registering now requires OTP
        const data = await registerUser(form);
        setUserId(data.userId);
        setDebugOtp(data.debugOtp);
        setStep(2);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (!otpForm.emailOtp) {
       setError("Please enter the Email OTP");
       return;
    }
    
    setLoading(true);
    try {
      const userData = await verifyRegisterOtpAPI(userId, otpForm.emailOtp);
      login(userData);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

      {/* OVERLAY */}
      <div style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.3)"
      }} />

      {/* LOGIN CARD */}
      <div style={{
        position: "relative",
        width: "360px",
        padding: "30px",
        borderRadius: "15px",
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        textAlign: "center"
      }}>

        <h2 style={{
          marginBottom: "20px",
          color: "#6D4C41",
          fontWeight: "600"
        }}>
          {step === 2 ? "Verify Registration" : (isLogin ? "Welcome Back" : "Welcome to Aureloom")}
        </h2>

        {/* ERROR */}
        {error && (
          <div style={{
            background: "#ffebee",
            color: "#c62828",
            padding: "8px",
            borderRadius: "6px",
            marginBottom: "10px",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <>
            {!isLogin && (
              <input name="name" placeholder="Full Name" onChange={handleChange} style={inputStyle} />
            )}
            <input name="email" placeholder="Email Address" onChange={handleChange} style={inputStyle} />
            {!isLogin && (
              <input name="phone" placeholder="Phone Number" onChange={handleChange} style={inputStyle} />
            )}
            <input type="password" name="password" placeholder="Password" onChange={handleChange} style={inputStyle} />

            {!isLogin && (
              <select name="role" onChange={handleChange} style={inputStyle}>
                <option value="buyer">Buyer</option>
                <option value="artisan">Artisan</option>
              </select>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                background: loading ? "#9E9E9E" : "#6D4C41",
                color: "white",
                border: "none",
                borderRadius: "8px",
                marginTop: "10px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Please wait..." : (isLogin ? "Login" : "Register")}
            </button>

            {/* TOGGLE */}
            <p style={{ marginTop: "15px", color: "#666", fontSize: "14px" }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span
                onClick={() => { setIsLogin(!isLogin); setError(""); setStep(1); setUserId(null); }}
                style={{ color: "#6D4C41", fontWeight: "bold", cursor: "pointer" }}
              >
                {isLogin ? "Register" : "Login"}
              </span>
            </p>
          </>
        ) : (
          <>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "5px" }}>
              We've sent verification codes to:
            </p>
            <div style={{ fontSize: "13px", color: "#6D4C41", fontWeight: "bold", marginBottom: "15px" }}>
               📧 {form.email}
            </div>

            {debugOtp && (
              <div style={{
                background: "#E8F5E9",
                color: "#2E7D32",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "15px",
                fontSize: "13px",
                border: "1px dashed #2E7D32"
              }}>
                <strong>Dev Mode OTP:</strong><br />
                Email OTP: <span style={{fontWeight: 'bold'}}>{debugOtp.emailOtp}</span>
              </div>
            )}

            <p style={{ color: "#888", fontSize: "12px", marginBottom: "10px" }}>
              Please enter the 6-digit code below:
            </p>

            <input 
              name="emailOtp" 
              placeholder="Enter 6-Digit Email OTP" 
              value={otpForm.emailOtp}
              onChange={handleOtpChange} 
              style={inputStyle} 
              maxLength="6"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                background: loading ? "#9E9E9E" : "#6D4C41",
                color: "white",
                border: "none",
                borderRadius: "8px",
                marginTop: "10px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Verifying..." : "Complete Registration"}
            </button>
            <p style={{ marginTop: "15px", color: "#666", fontSize: "14px" }}>
              <span
                onClick={() => { setStep(1); setError(""); }}
                style={{ color: "#6D4C41", fontWeight: "bold", cursor: "pointer" }}
              >
                ← Edit Registration Details
              </span>
            </p>
          </>
        )}

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