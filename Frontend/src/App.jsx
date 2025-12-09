import "./App.css";
import { BrowserRouter, Router, Routes, Route } from "react-router-dom";
import Login from "./component/login.jsx";
import SignUp from "./component/SignUp.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
