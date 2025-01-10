import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { isObjectIdOrHexString } from "mongoose";
import { internalServerErr, badRequestErr } from "../../utils/errorHandling.js";
import { emailRegex, tokenRegex, passwordRegex } from "../../utils/patterns.js";
import User from "../../models/user.js";
import Token from "../../models/token.js";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.MAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const getUserByEmail = async (email) => {
  try {
    // Validate email using regex
    if (!emailRegex.test(email)) {
      throw badRequestErr("Invalid email format.");
    }

    // Query the database for the user
    const user = await User.findOne({ email: email });

    // Check if user exists
    if (!user) {
      throw badRequestErr("User not found.");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

const generateLink = async (user) => {
  // create token
  const token = crypto.randomBytes(32).toString("hex");
  const resetLink = `${process.env.DOMAIN}/forgotPassword/resetPassword/${user._id}?token=${token}`;

  // Set expiration time 1 hour from now)
  const expirationTime = Date.now() + 3600000; // 1 hour in milliseconds

  // create Token instance
  const savedToken = new Token({
    userId: user._id,
    token: token,
    expires: new Date(expirationTime), // Setting expiration date
  });

  // save token to db
  await savedToken.save();

  if (!savedToken) {
    throw internalServerErr("Failed to save token.");
  }

  return resetLink;
};

const sendMail = async (username, email, resetLink) => {
  try {
    await transporter.sendMail({
      to: email,
      subject: "Password reset link for RegisterAPI",
      html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
          color: #333;
        }
        p {
          color: #555;
        }
        .button {
          display: inline-block;
          padding: 12px 20px;
          background-color: #007BFF;
          color:  rgb(255, 255, 255);
          text-decoration: none;
          border-radius: 4px;
          font-size: 16px;
        }
        .footer {
          font-size: 12px;
          color: #888;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Password Reset Request</h2>
        <p>Hello <strong>${username}</strong>,</p>
        <p>We received a request to reset your password. If you did not request this, you can ignore this email.</p>
        <p>To reset your password, click the link below:</p>
        <a href="${resetLink}" class="button">Reset Your Password</a>
      </div>
    </body>
    </html>`,
    });
  } catch (error) {
    console.log(error);
    throw internalServerErr("Failed to send recovery link.");
  }
  return true;
};

const sanitizeInput = (userId, password, token) => {
  const [sanitizedUserId, sanitizedPassword] = [userId.trim(), password.trim()];
  if (
    !userId ||
    !password ||
    !token ||
    !isObjectIdOrHexString(userId) ||
    !passwordRegex.test(password) ||
    !tokenRegex.test(token)
  ) {
    throw badRequestErr("Invalid input.");
  }
  return [sanitizedUserId, sanitizedPassword, token];
};

const validateToken = async (userId, token) => {
  // find token in db
  const tokenDoc = await Token.findOne({ userId: userId, token: token });

  // token is not found
  if (!tokenDoc) {
    throw notFoundErr("Use a valid recovery link");
  }

  // Check if the token has expired
  const currentTime = Date.now();
  if (tokenDoc.expires < currentTime) {
    throw badRequestErr("The password reset link has expired");
  }

  // Token is valid
  return true;
};

const savePassword = async (userId, password) => {
  // bcrypt password before saving it to the database
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
  const hashedPassword = await bcrypt.hash(password, salt);

  // update password in db
  await User.updateOne({ _id: userId }, { password: hashedPassword });

  // delete token from db
  await Token.deleteOne({ userId: userId });

  return true;
};

export {
  getUserByEmail,
  generateLink,
  sendMail,
  sanitizeInput,
  validateToken,
  savePassword,
};
