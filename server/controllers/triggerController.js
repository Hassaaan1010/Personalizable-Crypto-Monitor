import { sendErrResp } from "../utils/errorHandling.js";
import { createTriggerHelper } from "./helpers/triggerHelpers.js";

const createTrigger = async (req, res) => {
  try {
    const { userId, coin, maxLimit, minLimit } = req.body;
    console.log("reched contorller");
    const createdTrigger = await createTriggerHelper(
      userId,
      coin,
      maxLimit,
      minLimit
    );
    console.log("helper done");

    return res.status(201).json({
      success: true,
      message: "Trigger created successfully.",
    });
  } catch (error) {
    sendErrResp(res, error);
  }
};

export { createTrigger };
