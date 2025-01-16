import axios from "axios";
import User from "../../models/user.js";
import { isObjectIdOrHexString } from "mongoose";
import { badRequestErr } from "../../utils/errorHandling.js";
import redisClient from "../../config/redisConf.js";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price";
const COINGECKO_SEARCH_URL = "https://api.coingecko.com/api/v3/search";

const getUserById = async (id) => {
  if (!id || !isObjectIdOrHexString(id)) {
    throw badRequestErr("Invalid user ID.");
  }

  const user = User.findOne({ _id: id });

  if (!user) {
    throw badRequestErr("User not found.");
  }
  return user;
};

// const getCoinsByNames = async (coins) => {
//   if (!coins || !Array.isArray(coins) || coins.length === 0) {
//     throw badRequestErr("Invalid list of coin names.");
//   }

//   const cacheMissedCoins = [];

//   // for all coins, check for each coin in redis cache and append all cache miss coins to cacheMissedCoins
//   for (let coin in coins){
//     const coinPrice = await redisClient.get(`coin:${coin}`);

//     // store cache hit results somewhere

//     if (!coinPrice) {
//       cacheMissedCoins.push(coin);
//     }

//   }

//   // Join the coin names into a comma-separated string to send in the API request
//   const coinIds = cacheMissedCoins.join(",");

//   // Send the API request to CoinGecko to fetch the prices
//   const response = await axios.get(COINGECKO_API_URL, {
//     params: {
//       ids: coinIds,
//       vs_currencies: "inr",
//     },
//   });

//   if (!response.data) {
//     throw internalServerErr("Failed to fetch cryptocurrency data.");
//   }

//   return response.data;
// };

const getCoinsByNames = async (coins) => {
  if (!coins || coins.length === 0) {
    return {};
  }
  if (!Array.isArray(coins)) {
    console.log(coins);
    throw badRequestErr("Invalid list of coin names.");
  }

  const cacheMissedCoins = [];
  const cacheHitData = {};

  // Check for each coin in Redis cache and append cache miss coins to cacheMissedCoins
  for (let coin of coins) {
    const coinPrice = await redisClient.get(`coin:${coin}`);

    if (coinPrice) {
      // Cache hit: store the result
      cacheHitData[coin] = JSON.parse(coinPrice);
    } else {
      // Cache miss: append to the list of coins to fetch
      cacheMissedCoins.push(coin);
    }
  }

  // If there are cache misses, fetch from CoinGecko
  if (cacheMissedCoins.length > 0) {
    // Join the coin names into a comma-separated string for API request
    const coinIds = cacheMissedCoins.join(",");

    // Fetch the prices from CoinGecko
    const response = await axios.get(COINGECKO_API_URL, {
      params: {
        ids: coinIds,
        vs_currencies: "inr",
      },
    });

    if (!response.data) {
      throw internalServerErr("Failed to fetch cryptocurrency data.");
    }

    // Process the API response and cache each coin's price
    for (const coinId in response.data) {
      const coinPrice = response.data[coinId];

      // Cache the coin's price individually
      await redisClient.set(
        `coin:${coinId}`,
        JSON.stringify(coinPrice),
        "EX",
        60 // Set cache expiration time (adjust as needed)
      );

      // Add the coin price to the result
      cacheHitData[coinId] = coinPrice;
    }
  }

  // Return the combined data (both cache hits and new API data)
  return cacheHitData;
};

export {
  getUserById,
  getCoinsByNames,
  COINGECKO_API_URL,
  COINGECKO_SEARCH_URL,
};
