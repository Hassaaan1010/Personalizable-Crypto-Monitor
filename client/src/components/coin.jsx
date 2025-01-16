import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Coin = () => {
  const { id } = useParams(); // Extract coin ID from the route
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:4000";
  const [coinDetails, setCoinDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCoinDetails = async () => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}`
      );
      setCoinDetails(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching coin details:", err);
      setError("Failed to fetch coin details.");
      setLoading(false);
    }
  };

  const handleAddCoin = async () => {
    const userId = localStorage.getItem("userId"); // Get user ID from localStorage
    if (!userId) {
      alert("User not logged in!");
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/crypto/addCoin`,
        { userId, coinId: id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        }
      );
      if (response.data.success) {
        alert("Coin added successfully!");
      } else {
        alert("Failed to add coin.");
      }
    } catch (err) {
      console.error("Error adding coin:", err);
      alert("Failed to add coin.");
    }
  };

  useEffect(() => {
    fetchCoinDetails();
    const interval = setInterval(fetchCoinDetails, 60000); // Update every 1 minute
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [id]);

  if (loading) return <p>Loading coin details...</p>;
  if (error) return <p>{error}</p>;

  const { image, name, symbol, market_data } = coinDetails;

  return (
    <div style={styles.card}>
      <img src={image.large} alt={name} style={styles.image} />
      <h2>
        {name} ({symbol.toUpperCase()})
      </h2>
      <p>
        <strong>ID:</strong> {id}
      </p>
      <p>
        <strong>Current Price:</strong> ₹
        {market_data.current_price.inr.toLocaleString()}
      </p>
      <p>
        <strong>Market Cap:</strong> ₹
        {market_data.market_cap.inr.toLocaleString()}
      </p>
      <p>
        <strong>24h High:</strong> ₹{market_data.high_24h.inr.toLocaleString()}
      </p>
      <p>
        <strong>24h Low:</strong> ₹{market_data.low_24h.inr.toLocaleString()}
      </p>
      <button style={styles.button} onClick={handleAddCoin}>
        Add Coin
      </button>
    </div>
  );
};

const styles = {
  card: {
    margin: "2rem auto",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    maxWidth: "400px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: "100px",
    height: "100px",
    marginBottom: "1rem",
  },
  button: {
    padding: "0.8rem 1.2rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Coin;
