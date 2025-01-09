import { sendErrResp } from "../utils/errorHandling.js";
import { createJwtToken, createUser, saveUser } from "./helpers/authHelpers.js";

const login = async (req, res) => {
  res.status(200);
};

const register = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    // validate and create new user
    const newUser = await createUser(username, email, password);

    // save to db
    await saveUser(newUser);

    console.log("saved");

    // create jwt token
    const token = await createJwtToken(newUser);

    console.log("token made");

    // Response: token, username, _id
    return res.status(201).json({
      token: token,
      username: newUser.username,
      _id: newUser._id,
    });
    // return res.status(200);
  } catch (error) {
    console.log(error);
    console.log(error.status, error.message);

    sendErrResp(res, { status: error.status, message: error.message });
  }
};

export { login, register };
