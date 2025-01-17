import {
  badRequestErr,
  internalServerErr,
  sendErrResp,
} from "../utils/errorHandling.js";
import {
  getUserByEmail,
  generateLink,
  sendMail,
  savePassword,
  validateToken,
  sanitizeInput,
} from "./helpers/forgotPasswordHelpers.js";

const sendRecoveryLink = async (req, res) => {
  try {
    // Sanitize email
    let { email } = req.body;
    email = email.trim().toLowerCase();

    // verify user exists (sanitize email using trim, regex ... )
    const user = await getUserByEmail(email); //define this helper function

    // generate password reset link "
    const resetLink = await generateLink(user);

    // send email
    const mailSuccess = await sendMail(user.username, email, resetLink); //define helper function

    if (!mailSuccess) {
      throw internalServerErr("Failed to send recovery mail");
    }

    return res.status(200).json({ message: "Recoverly link sent." });
  } catch (error) {
    console.log(error);
    sendErrResp(res, error);
  }
};

const resetPassword = async (req, res) => {
  try {
    let { userId, password, token } = req.body;

    // sanitize and validate data
    [userId, password, token] = sanitizeInput(userId, password, token);

    // check if token is valid
    await validateToken(userId, token);

    // save new password
    await savePassword(userId, password);

    res.status(201).json({ message: "Password reset successfully." });
  } catch (error) {
    console.log(error);
    sendErrResp(res, error);
  }
};

export { sendRecoveryLink, resetPassword };
