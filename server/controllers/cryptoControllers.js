import axios from "axios"
import {sendErrResp} from "../utils/errorHandling.js"
import {COINGECKO_API_URL, getUserById, getCoinsByNames} from "./helpers/cryptoHelpers.js"

const getTopCoins = async (req, res) => {
    try {
      const response = await axios.get(COINGECKO_API_URL, {
        params: {
          ids: "bitcoin,ethereum,cardano,solana", // Add your desired coins here
          vs_currencies: "inr", // Convert to INR
        },
      });
      res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching top coins:", error.message);
        sendErrResp(error)
    }
  }

const getUsersCoins = async (req, res) => {
    try {
        // console.log(req.query, "asdf",req.params)
        const {userId : id} = req.query

        const user = await getUserById(id);

        const userCoins = await getCoinsByNames(user.coins);
        console.log(userCoins)
        res.status(200).json({userCoins:userCoins})
    } catch (error) {
        console.log("Error getting users coins:" , error)
        sendErrResp(error)
    }

}


export {getTopCoins, getUsersCoins}