import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styleSheets/searchCoins.css"; // Import the CSS file for styling
import "../styleSheets/navbar.css";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:4000";

  const fetchSearchResults = async (searchQuery) => {
    try {
      setIsSearching(true);
      const response = await axios.get(`${baseUrl}/crypto/search`, {
        params: { query: searchQuery },
      });
      setResults(response.data.data);
      setIsSearching(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setIsSearching(false);
    }
  };

  // Debounce handler
  useEffect(() => {
    if (query) {
      const timeoutId = setTimeout(() => {
        fetchSearchResults(query);
      }, 1000); // 1 second debounce

      return () => clearTimeout(timeoutId); // Clear timeout on query change
    } else {
      setResults([]); // Clear results if query is empty
    }
  }, [query]);

  return (
    <>
      <h1>Search</h1>
      <div className="button-container">
        <Link to="/topCoins">
          <button className="submit-button">Top Coins</button>
        </Link>
        <Link to="/home">
          <button className="submit-button">Home</button>
        </Link>
      </div>

      <div className="search-page">
        <div className="search-bar-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search for a cryptocurrency..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="search-button"
            onClick={() => fetchSearchResults(query)}
          >
            Enter
          </button>
        </div>
        <div className="search-results">
          {isSearching && <div className="loading">Searching...</div>}
          {results.map((coin) => (
            <div key={coin.id} className="result-item">
              <Link to={`/coin/${coin.id}`} className="result-link">
                <img
                  src={coin.thumb}
                  alt={coin.name}
                  className="result-image"
                />
                <div className="result-details">
                  <span className="result-name">
                    {coin.name}{" "}
                    <span className="result-symbol">{coin.symbol}</span>
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
