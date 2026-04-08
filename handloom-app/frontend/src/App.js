import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import Dashboard from "./components/Dashboard";
import Artisans from "./components/Artisans";
import Wishlist from "./components/Wishlist";
import Profile from "./components/Profile";
import ProductsPage from "./components/ProductsPage";
import ArtisanDetails from "./components/ArtisanDetails";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🏠 Home */}
        <Route path="/" element={<Home />} />

        {/* 🔐 Login */}
        <Route path="/login" element={<Login />} />

        {/* 🛍️ Products */}
        <Route path="/products" element={<ProductsPage />} /> {/* ✅ NEW */}

        {/* 📦 Product Details */}
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* 🛒 Cart */}
        <Route path="/cart" element={<Cart />} />

        {/* 📊 Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 🧑‍🎨 Artisans */}
        <Route path="/artisans" element={<Artisans />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/artisan/:id" element={<ArtisanDetails />} />
      </Routes>
    </Router>
  );
}

export default App;