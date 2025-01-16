import Trigger from "../../models/trigger.js";
import nodemailer from "nodemailer";
import { badRequestErr } from "../../utils/errorHandling.js";
import { isObjectIdOrHexString } from "mongoose";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const sendTriggerEmail = async (userEmail, coin, price, triggerType) => {
  const mailOptions = {
    from: "register.apibot@gmail.com",
    to: userEmail,
    subject: `Price Alert for ${coin}`,
    text: `The price of ${coin} has ${triggerType} your set threshold. Current price: ${price} INR`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const createTriggerHelper = async (userId, coin, maxLimit, minLimit) => {
  if (
    !userId ||
    !isObjectIdOrHexString(userId) ||
    !coin ||
    !maxLimit ||
    !minLimit ||
    maxLimit <= minLimit
  ) {
    throw badRequestErr("Invalid input.");
  }

  // Create a new trigger
  const trigger = new Trigger({
    userId,
    coin,
    maxLimit: maxLimit,
    minLimit: minLimit,
    createdAt: new Date(),
  });

  const newTrigger = await trigger.save();

  if (!newTrigger) {
    throw internalServerErr("Failed to create trigger.");
  }

  return true;
};

export { createTriggerHelper, sendTriggerEmail };
