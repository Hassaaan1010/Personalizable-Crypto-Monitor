import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Import React Router components
import "./App.css";
import { HashRouter as Router } from "react-router-dom";

// Import your components
import Home from "./components/home";
import Login from "./components/login";
import Register from "./components/register";
import ForgotPassword from "./components/forgotPassword";
import ResetPassword from "./components/resetPassword";

function App() {
  return (
    // <BrowserRouter>
    <HashRouter>
      <div className="App">
        <Routes>
          {/* Define your routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route
            path="/forgotPassword/resetPassword/:userId"
            element={<ResetPassword />}
          />
          <Route path="*" element={<Navigate replace to="/login" />} />{" "}
        </Routes>
      </div>
    </HashRouter>
    // </BrowserRouter>
  );
}

export default App;
