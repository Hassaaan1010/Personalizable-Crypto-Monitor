import Trigger from "../models/trigger.js"; // Assuming the trigger model is already set up
import User from "../models/user.js";
import redisClient from "../config/redisConf.js"; // Assuming Redis is set up
import connect_database from "../config/mongoConf.js";
import { sendTriggerEmail } from "../controllers/helpers/triggerHelpers.js";
import axios from "axios";
import { COINGECKO_API_URL } from "../controllers/helpers/cryptoHelpers.js";
// connect to database before running the notifier
try {
  await connect_database();
  console.log("Database connected to trigger notifier.");
} catch (error) {
  console.log(error);
}

const monitorPriceTriggers = async () => {
  console.log("Monitoring price triggers...");
  try {
    // Get all triggers from the database
    const triggers = await Trigger.find();

    for (const trigger of triggers) {
      const { coin, maxLimit, minLimit, userId, activated } = trigger;

      // Get the current price from the cache
      let coinPrice = await redisClient.get(`coin:${coin}`);
      if (!coinPrice) {
        console.log(`No price found for ${coin} in the cache.`);
        const response = await axios.get(COINGECKO_API_URL, {
          params: {
            ids: coin,
            vs_currencies: "inr",
          },
        });

        coinPrice = response.data[coin]?.inr; // Get price from API response
        if (!coinPrice) {
          console.log(`Unable to fetch price for ${coin} from API.`);
          continue;
        }

        // Cache the price
        await redisClient.set(
          `coin:${coin}`,
          JSON.stringify({ inr: coinPrice }),
          "EX",
          60
        );
      } else {
        coinPrice = JSON.parse(coinPrice).inr; // Parse cached price
      }

      // Check if the price exceeds limits and trigger isn't activated
      if (!activated && (coinPrice >= maxLimit || coinPrice <= minLimit)) {
        const user = await User.findById(userId);
        if (!user) {
          console.log(`User with ID ${userId} not found.`);
          continue;
        }

        // Send email notification
        await sendTriggerEmail(
          user.email,
          coin,
          coinPrice,
          coinPrice >= maxLimit ? "reached" : "fell to"
        );

        // Activate the trigger
        trigger.activated = true;
        await trigger.save();
      }

      // If trigger is activated and price is back within limits, deactivate
      if (activated && coinPrice < maxLimit && coinPrice > minLimit) {
        trigger.activated = false;
        await trigger.save();
      }
    }
  } catch (error) {
    console.error("Error monitoring price triggers:", error);
  }
};

// Call the monitor function every minute or based on your preferred interval
monitorPriceTriggers();
setInterval(monitorPriceTriggers, 40000); // Run 40 seconds
