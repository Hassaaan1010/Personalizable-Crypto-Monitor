import axios from "axios";
import User from "../models/user.js";
import redisClient from "../config/redisConf.js";
import connect_database from "../config/mongoConf.js";

try {
  await connect_database();
  console.log("Database connected to price fetcher.");
} catch (error) {
  console.log(error);
}

// Fetch and cache crypto prices
const fetchAndCachePrices = async () => {
  try {
    // get names of all coins from the database
    // const coins = ["bitcoin", "ethereum", "cardano", "solana"];
    const coinsArray = await User.find({}, { coins: 1 }).lean();

    // Flatten the array of coins
    const coins = coinsArray.flatMap((user) => user.coins);

    // convert to comma separated string
    const coinIds = coins.join(",");

    // Fetch prices from CoinGecko API
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: coinIds, // Add more coins if needed
          vs_currencies: "inr", // Currencies to monitor
        },
      }
    );
    console.log("Fetched prices successfully:", response.data);

    // Cache each coin's price separately as key-value pairs in Redis
    for (const coinId in response.data) {
      const coinPrice = response.data[coinId];

      // Cache each coin individually
      await redisClient.set(
        `coin:${coinId}`, // Unique key for each coin
        JSON.stringify(coinPrice),
        "EX",
        60 // Set cache expiration time (adjust as needed)
      );
    }

    console.log("Cached individual coins successfully.");
  } catch (error) {
    console.error("Error fetching or caching prices:", error.message);
  }
};

// Run fetcher every 2 minute
fetchAndCachePrices();
setInterval(fetchAndCachePrices, 60000);

// Log startup message
console.log("Price fetcher service is running...");
