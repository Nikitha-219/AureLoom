const API_BASE = "http://localhost:5000/api";

// Get stored token
const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token || "";
};

// Headers with auth
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`
});

// Public headers (no auth)
const publicHeaders = () => ({
  "Content-Type": "application/json"
});

// ========================
// AUTH
// ========================
export const registerUser = async (formData) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: publicHeaders(),
    body: JSON.stringify(formData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: publicHeaders(),
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
};

export const verifyRegisterOtpAPI = async (userId, emailOtp) => {
  const res = await fetch(`${API_BASE}/auth/verify-register-otp`, {
    method: "POST",
    headers: publicHeaders(),
    body: JSON.stringify({ userId, emailOtp })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "OTP verification failed");
  return data;
};

export const getMe = async () => {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: authHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

// ========================
// PRODUCTS
// ========================
export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/products?${query}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${API_BASE}/products/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

// ========================
// ARTISANS
// ========================
export const fetchArtisans = async () => {
  const res = await fetch(`${API_BASE}/artisans`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const fetchArtisanById = async (id) => {
  const res = await fetch(`${API_BASE}/artisans/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

// ========================
// CART
// ========================
export const fetchCart = async () => {
  const res = await fetch(`${API_BASE}/cart`, {
    headers: authHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const addToCartAPI = async (productId, qty = 1) => {
  const res = await fetch(`${API_BASE}/cart/add`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ productId, qty })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const updateCartItemAPI = async (productId, qty) => {
  const res = await fetch(`${API_BASE}/cart/update`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ productId, qty })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const removeFromCartAPI = async (productId) => {
  const res = await fetch(`${API_BASE}/cart/remove/${productId}`, {
    method: "DELETE",
    headers: authHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const clearCartAPI = async () => {
  const res = await fetch(`${API_BASE}/cart/clear`, {
    method: "DELETE",
    headers: authHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

// ========================
// WISHLIST
// ========================
export const fetchWishlist = async () => {
  const res = await fetch(`${API_BASE}/wishlist`, {
    headers: authHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const toggleWishlistAPI = async (productId) => {
  const res = await fetch(`${API_BASE}/wishlist/toggle/${productId}`, {
    method: "POST",
    headers: authHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

// ========================
// ORDERS
// ========================
export const placeOrderAPI = async (shippingAddress, paymentMethod = "COD") => {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ shippingAddress, paymentMethod })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const fetchOrders = async () => {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: authHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

// ========================
// PROFILE
// ========================
export const updateProfileAPI = async (profileData) => {
  const res = await fetch(`${API_BASE}/users/profile`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(profileData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

// ========================
// REVIEWS
// ========================
export const addReviewAPI = async (productId, rating, comment) => {
  const res = await fetch(`${API_BASE}/reviews/${productId}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ rating, comment })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const fetchReviews = async (productId) => {
  const res = await fetch(`${API_BASE}/reviews/${productId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};
