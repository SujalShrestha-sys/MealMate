import "./App.css";
<<<<<<< HEAD
import { BrowserRouter, Router, Routes, Route } from "react-router-dom";
import Login from "./component/login.jsx";
import SignUp from "./component/SignUp.jsx";

=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import PlansPage from "./pages/PlansPage.jsx";
import Login from "./components/auth/Login.jsx";
import SignUp from "./components/auth/SignUp.jsx";
>>>>>>> 16a4050120c1d3f86379ed7ae9d6dcef44a2a2fa
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
