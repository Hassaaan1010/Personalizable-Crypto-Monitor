import axios from "axios";
import {
  notFoundErr,
  sendErrResp,
  badRequestErr,
} from "../utils/errorHandling.js";
import {
  COINGECKO_API_URL,
  COINGECKO_SEARCH_URL,
  getTopCoinsHelper,
  getUserById,
  getCoinsByNames,
} from "./helpers/cryptoHelpers.js";

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

    const responseData = await getTopCoinsHelper(topCoins);

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching top coins:", error.message);
    return res.status(500).json({ error: "Failed to fetch top coins data." });
  }
};

const getUsersCoins = async (req, res) => {
  try {
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

    if (query.length > 25) {
      throw badRequestErr("Query length exceeded (25).");
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
    const { userId, coinId } = req.body;

    const user = await getUserById(userId);

    if (user.coins.includes(coinId)) {
      throw badRequestErr("Coin already exists in user's list.");
    }

    user.coins.push(coinId);
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
