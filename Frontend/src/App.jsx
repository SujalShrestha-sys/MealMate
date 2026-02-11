import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import PlansPage from "./pages/PlansPage.jsx";
import FoodDetailsPage from "./pages/FoodDetailsPage.jsx";
import Login from "./components/auth/Login.jsx";
import SignUp from "./components/auth/SignUp.jsx";
import ForgotPassword from "./components/auth/ForgotPassword.jsx";
import ResetPassword from "./components/auth/ResetPassword.jsx";
import ChatWidget from "./components/chat/ChatWidget.jsx";
import "./App.css";

function App() {
  const [cart, setCart] = useState({});
  const location = useLocation();

  const updateQuantity = (productId, delta) => {
    setCart((prevCart) => {
      const newQuantity = (prevCart[productId] || 0) + delta;
      if (newQuantity <= 0) {
        const { [productId]: _, ...rest } = prevCart;
        return rest;
      }
      return { ...prevCart, [productId]: newQuantity };
    });
  };

  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(location.pathname.toLowerCase()) || location.pathname.toLowerCase().startsWith("/reset-password");

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/menu"
          element={<MenuPage cart={cart} updateQuantity={updateQuantity} />}
        />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/food/:id"
          element={
            <FoodDetailsPage cart={cart} updateQuantity={updateQuantity} />
          }
        />
      </Routes>
      {!isAuthPage && <ChatWidget />}
    </>
  );
}

export default App;
