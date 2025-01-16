import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styleSheets/topCoins.css"; // Import the CSS file for styling
import "../styleSheets/navbar.css";

const TopCoins = () => {
  const [coins, setCoins] = useState([]);
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:4000";

  const fetchTopCoins = async () => {
    try {
      const response = await axios.get(`${baseUrl}/crypto/topCoins`);
      setCoins(response.data);
    } catch (error) {
      console.error("Error fetching top coins:", error);
    }
  };

  useEffect(() => {
    fetchTopCoins(); // Fetch data on component mount

    const intervalId = setInterval(() => {
      fetchTopCoins(); // Fetch data every 60 seconds
    }, 60000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <>
      <div>
        <h1>Top Coins</h1>
        <p>Updates every minute!</p>
      </div>
      <div className="button-container">
        <Link to="/home">
          <button className="submit-button">Home</button>
        </Link>
        <Link to="/searchCoins">
          <button className="submit-button">Search</button>
        </Link>
      </div>
      <div className="top-coins-container">
        {coins.map((coin) => (
          <div key={coin.id} className="coin-tab">
            <Link to={`/coin/${coin.id}`} className="coin-link">
              <img src={coin.image} alt={coin.name} className="coin-image" />
              <div className="coin-details">
                <span className="coin-name">{coin.name}</span>
                <span className="coin-price">
                  ₹{coin.current_price.toLocaleString()}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default TopCoins;
