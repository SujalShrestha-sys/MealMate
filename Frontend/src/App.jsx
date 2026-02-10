import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import PlansPage from "./pages/PlansPage.jsx";
import FoodDetailsPage from "./pages/FoodDetailsPage.jsx";
import Login from "./components/auth/Login.jsx";
import SignUp from "./components/auth/SignUp.jsx";
import ChatWidget from "./components/chat/ChatWidget.jsx";

function App() {
  const [cart, setCart] = useState({});

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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<MenuPage cart={cart} updateQuantity={updateQuantity} />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/food/:id" element={<FoodDetailsPage cart={cart} updateQuantity={updateQuantity} />} />
      </Routes>
      <ChatWidget />
    </BrowserRouter>
  );
}

export default App;
