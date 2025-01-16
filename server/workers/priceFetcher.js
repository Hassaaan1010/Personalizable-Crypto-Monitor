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
    console.log("Fetched prices successfully:");

    // Cache the response in Redis with an expiration of 60 seconds
    await redisClient.set(
      "cryptoPrices",
      JSON.stringify(response.data),
      "EX",
      60
    );
    console.log("Prices cached successfully:", response.data);
  } catch (error) {
    console.error("Error fetching or caching prices:", error.message);
  }
};

// Run fetcher every 2 minute
setInterval(fetchAndCachePrices, 60000);

// Log startup message
console.log("Price fetcher service is running...");
