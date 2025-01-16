import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Import React Router components
import "./App.css";

// Import your components
import Home from "./components/home";
import Login from "./components/login";
import Register from "./components/register";
import ForgotPassword from "./components/forgotPassword";
import ResetPassword from "./components/resetPassword";
import Coin from "./components/coin";
import TopCoins from "./components/topCoins";
import SearchPage from "./components/searchCoins";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Define your routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/coin/:id" element={<Coin />} />
          <Route path="topCoins" element={<TopCoins />} />
          <Route path="searchCoins" element={<SearchPage />} />
          <Route
            path="/forgotPassword/resetPassword/:userId"
            element={<ResetPassword />}
          />
          <Route path="*" element={<Navigate replace to="/login" />} />{" "}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
