import { sendErrResp } from "../utils/errorHandling.js";
import { createJwtToken, createUser, saveUser } from "./helpers/authHelpers.js";

const login = async () => {};

const register = async (req, res) => {
  try {
    let [username, email, password] = req.body;

    // validate and create new user
    const newUser = createUser(username, email, password);

    // save to db
    await saveUser(newUser);

    // create jwt token
    const token = await createJwtToken(newUser);

    // Response: token, username, _id
    return res.status(201).json({
      token: token,
      username: newUser.username,
      _id: newUser._id,
    });
  } catch (error) {
    console.log(error);
    sendErrResp(res, { status: 500, message: "Error registering user" });
  }
};

export { login, register };
