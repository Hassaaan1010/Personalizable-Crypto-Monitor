import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Coin = () => {
  const { id } = useParams();
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:4000";
  const [coinDetails, setCoinDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTriggerForm, setShowTriggerForm] = useState(false);
  const [minLimit, setMinLimit] = useState("");
  const [maxLimit, setMaxLimit] = useState("");

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
    const userId = localStorage.getItem("userId");
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

  const handleRemoveCoin = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in!");
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/crypto/removeCoin`,
        { userId, coinName: id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        }
      );
      if (response.data.success) {
        alert("Coin removed successfully!");
      } else {
        alert("Failed to remove coin.");
      }
    } catch (err) {
      console.error("Error removing coin:", err);
      alert("Failed to remove coin.");
    }
  };

  const handleCreateTrigger = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in!");
      return;
    }

    if (!minLimit || !maxLimit) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/trigger/createTrigger`,
        { userId, coin: id, maxLimit, minLimit },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        }
      );
      if (response.data.success) {
        alert("Trigger created successfully!");
        setShowTriggerForm(false);
        setMinLimit("");
        setMaxLimit("");
      } else {
        alert("Failed to create trigger.");
      }
    } catch (err) {
      console.error("Error creating trigger:", err);
      alert("Failed to create trigger.");
    }
  };

  useEffect(() => {
    fetchCoinDetails();
    const interval = setInterval(fetchCoinDetails, 60000); // Update every 1 minute
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <p>Loading coin details...</p>;
  if (error) return <p>{error}</p>;

  const { image, name, symbol, market_data } = coinDetails;

  return (
    <div>
      <div>
        <img src={image.large} alt={name} />
        <h2>
          {name} ({symbol.toUpperCase()})
        </h2>
        <p>
          <strong>ID:</strong> {id}
        </p>
        <p>
          <strong>LIVE Price:</strong> ₹
          {market_data.current_price.inr.toLocaleString()}
        </p>
        <p>
          <strong>Market Cap:</strong> ₹
          {market_data.market_cap.inr.toLocaleString()}
        </p>
        <p>
          <strong>24h High:</strong> ₹
          {market_data.high_24h.inr.toLocaleString()}
        </p>
        <p>
          <strong>24h Low:</strong> ₹{market_data.low_24h.inr.toLocaleString()}
        </p>
        <button style={styles.addButton} onClick={handleAddCoin}>
          Add Coin
        </button>
        <button style={styles.removeButton} onClick={handleRemoveCoin}>
          Remove Coin
        </button>
        <button
          style={styles.triggerButton}
          onClick={() => setShowTriggerForm(true)}
        >
          Create Trigger
        </button>
      </div>
      {showTriggerForm && (
        <div>
          <form onSubmit={handleCreateTrigger}>
            <label>
              Min Limit:
              <input
                type="number"
                value={minLimit}
                onChange={(e) => setMinLimit(e.target.value)}
                required
              />
            </label>
            <label>
              Max Limit:
              <input
                type="number"
                value={maxLimit}
                onChange={(e) => setMaxLimit(e.target.value)}
                required
              />
            </label>
            <button style={styles.addButton} type="submit">
              Submit
            </button>
            <button
              style={styles.removeButton}
              type="button"
              onClick={() => setShowTriggerForm(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "20px",
    maxWidth: "400px",
    margin: "20px auto",
    textAlign: "center",
    backgroundColor: "lightgray",
  },
  image: {
    width: "100px",
    height: "100px",
    marginBottom: "20px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "limegreen",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  removeButton: {
    padding: "10px 20px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  triggerButton: {
    backgroundColor: "blue",
    color: "white",
    padding: "10px 20px",
    marginTop: "10px",
    width: "calc(80% + 20px)", // Adjust width to match Add and Remove buttons
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Coin;
