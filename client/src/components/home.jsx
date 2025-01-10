import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const baseUrl = "http://localhost:4000";
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthorization = async () => {
      const token = localStorage.getItem("jwt"); // Get JWT token from localStorage
      if (!token) {
        navigate("/login"); // Redirect to login if token is not available
        return;
      }

      try {
        console.log("going to get home");
        const response = await axios.get(`${baseUrl}/home/`, {
          headers: { Authorization: `Bearer ${token}` }, // Send token in Authorization header
        });
        console.log("Got response home.jsx");

        if (response.data.authorized) {
          console.log("Authorized");
        } else {
          navigate("/login"); // Redirect to login if not authorized
        }
      } catch (error) {
        console.error("Authorization failed:", error);
        navigate("/login"); // Redirect to login if request fails
      }
    };

    checkAuthorization();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <h1>Welcome to Home</h1>
      <a href="/login"></a>
      <button className="submit-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Home;
