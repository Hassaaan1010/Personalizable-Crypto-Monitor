import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styleSheets/home.css";

const Home = () => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:4000";
  const navigate = useNavigate();
  const [userCoins, setUserCoins] = useState(null);

  useEffect(() => {
    const checkAuthorization = async () => {
      const token = localStorage.getItem("jwt"); // Get JWT token from localStorage
      const userId = localStorage.getItem("userId"); // Get userId from localStorage

      if (!token || !userId) {
        navigate("/login"); // Redirect to login if token or userId is missing
        return;
      }

      try {
        console.log("Authorizing...");
        const authResponse = await axios.get(`${baseUrl}/home/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (authResponse.data.authorized) {
          console.log("Authorized");

          // Fetch user coins
          const coinResponse = await axios.get(
            `${baseUrl}/crypto/myCoins?userId=${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("User coins fetched:", coinResponse.data.userCoins);
          setUserCoins(coinResponse.data.userCoins);
        } else {
          navigate("/login"); // Redirect to login if not authorized
        }
      } catch (error) {
        console.error("Authorization or fetching coins failed:", error);
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
      <button className="submit-button" onClick={handleLogout}>
        Logout
      </button>
      <br />
      <div>
        <Link to="/topCoins">Top Coins</Link>
      </div>
      <div>
        <Link to="/searchCoins">Search</Link>
      </div>
      <br />
      {userCoins ? (
        <div className="home-container">
          <h2 className="home-heading">Your Coins</h2>
          <ul className="coins-list">
            {Object.entries(userCoins).map(([coin, data]) => (
              <li key={coin} className="coin-item">
                <a href={`/coin/${coin}`} className="coin-link">
                  {coin.charAt(0).toUpperCase() + coin.slice(1)}
                </a>
                <span className="coin-price">₹{data.inr.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="loading-message">Loading your coins...</p>
      )}
    </div>
  );
};

export default Home;
