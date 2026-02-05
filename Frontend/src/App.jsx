import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import Login from "./components/auth/Login.jsx";
import SignUp from "./components/auth/SignUp.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Home" element={<LandingPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
