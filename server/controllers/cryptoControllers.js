import axios from "axios";
import {
  notFoundErr,
  sendErrResp,
  badRequestErr,
} from "../utils/errorHandling.js";
import {
  COINGECKO_API_URL,
  COINGECKO_SEARCH_URL,
  getUserById,
  getCoinsByNames,
} from "./helpers/cryptoHelpers.js";
import redisClient from "../config/redisConf.js";

const getTopCoins = async (req, res) => {
  try {
    const topCoins = [
      "bitcoin",
      "ethereum",
      "tether",
      "ripple",
      "binancecoin",
      "solana",
      "dogecoin",
      "usd-coin",
    ];
    const cacheKey = "topCoins";

    // Check if top coins data exists in the cache
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("Cache hit for top coins.");
      return res.status(200).json(JSON.parse(cachedData));
    }

    // If cache miss, fetch from CoinGecko API
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets" || COINGECKO_API_URL,
      {
        // params: {
        //   // ids: topCoins.join(","), // Join the coins array into a comma-separated string
        //   // vs_currencies: "inr", // Currency to convert to
        // },
        headers: {
          "x-cg-pro-api-key": process.env.COINGECKO_API_KEY,
        },
      }
    );

    const responseData = response.data;

    // Store the fetched data in Redis cache with a TTL (e.g., 60 seconds)
    await redisClient.set(cacheKey, JSON.stringify(responseData), "EX", 60);

    console.log("Cache miss. Fetched data from API and stored in cache.");
    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching top coins:", error.message);
    return sendErrResp(res, error);
  }
};

const getUsersCoins = async (req, res) => {
  try {
    // console.log(req.query, "asdf",req.params)
    const { userId: id } = req.query;

    // fetch user
    const user = await getUserById(id);

    const userCoins = await getCoinsByNames(user.coins);
    console.log(userCoins);
    res.status(200).json({ userCoins: userCoins });
  } catch (error) {
    console.log("Error getting users coins:", error);
    sendErrResp(res, error);
  }
};

const getSearchResults = async (req, res) => {
  try {
    const { query } = req.query;

    if (query.length() > 25) {
      throw badRequestError("Query length exceeded (25).");
    }

    // Call CoinGecko's search API
    const response = await axios.get(COINGECKO_SEARCH_URL, {
      params: { query },
    });

    if (!response) {
      throw notFoundErr("No results found.");
    }
    // Send back search results
    res.status(200).json({
      success: true,
      data: response.data.coins,
    });
  } catch (error) {
    console.log("Error fetching search results:", error);
    sendErrResp(res, error);
  }
};

const addCoin = async (req, res) => {
  try {
    const { userId, coinName } = req.body;

    const user = await getUserById(userId);

    if (user.coins.includes(coinName)) {
      throw badRequestErr("Coin already exists in user's list.");
    }

    user.coins.push(coinName);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Coin added successfully.",
    });
  } catch (error) {
    console.log("Error adding coin:", error);
    sendErrResp(res, error);
  }
};

const removeCoin = async (req, res) => {
  try {
    const { userId, coinName } = req.body;

    const user = await getUserById(userId);

    if (!user.coins.includes(coinName)) {
      throw badRequestErr("Coin does not exists in user's list.");
    }

    user.coins.pull(coinName);
    await user.save();
    res.status(201).json({
      success: true,
      message: "Coin removed successfully.",
    });
  } catch (error) {
    console.log("Error removing coin:", error);
    sendErrResp(res, error);
  }
};

export { getTopCoins, getUsersCoins, getSearchResults, addCoin, removeCoin };
