import axios from "axios"
import User from "../../models/user.js"
import { isObjectIdOrHexString } from "mongoose";
import {badRequestErr} from "../../utils/errorHandling.js"


const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price";


const getUserById = async (id) => {
    if (!id || !isObjectIdOrHexString(id)){
        throw badRequestErr("Invalid user ID.")
    }

    const user = User.findOne({_id : id})

    if (!user) {
        throw badRequestErr("User not found.")
    }
    return user
}

const getCoinsByNames = async (coins) => {
    if (!coins || !Array.isArray(coins) || coins.length === 0) {
      throw badRequestErr("Invalid list of coin names.");
    }
  
    // Join the coin names into a comma-separated string to send in the API request
    const coinIds = coins.join(",");
  
    // Send the API request to CoinGecko to fetch the prices
    const response = await axios.get(COINGECKO_API_URL, {
      params: {
        ids: coinIds,
        vs_currencies: "inr",
      },
    });
  
    if (!response.data) {
      throw internalServerErr("Failed to fetch cryptocurrency data.");
    }
  
    return response.data;
  };

export {getUserById, getCoinsByNames, COINGECKO_API_URL}