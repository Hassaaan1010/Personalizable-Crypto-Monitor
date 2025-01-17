import User from "../../models/user.js";
import bcrypt from "bcryptjs";
import {
  emailRegex,
  usernameRegex,
  passwordRegex,
} from "../../utils/patterns.js";
import {
  internalServerErr,
  badRequestErr,
  unauthorizedErr,
} from "../../utils/errorHandling.js";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const createUser = async (username, email, password) => {
  [username, email, password] = [
    username.trim(),
    email.trim().toLowerCase(),
    password.trim(),
  ];

  // required inputs exist
  if (!username || !email || !password) {
    throw badRequestErr("All fields are required");
  }

  // input validation
  switch (true) {
    case !usernameRegex.test(username):
      throw badRequestErr("Username must be 6-100 characters");
    case !emailRegex.test(email):
      throw badRequestErr("Invalid email format");
    case !passwordRegex.test(password):
      throw badRequestErr(
        "Password must contain at least one uppercase letter, one number, and be 6 characters or longer (upto 100)"
      );
    default:
      // validations passed
      break;
  }

  // bcrypt password before saving it to the database
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
  const hashedPassword = await bcrypt.hash(password, salt);

  // create a new user
  const newUser = new User({
    username: username.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
  });

  return newUser;
};

const saveUser = async (newUser) => {
  // check for duplication
  const { username, email } = newUser;
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw badRequestErr("Username or email already exists");
  }

  // save to db
  const success = newUser.save();
  if (!success) {
    throw internalServerErr("Failed to save user.");
  }
};

const createJwtToken = async (user) => {
  const expiresIn = "12h"; // 2 hour life

  console.log("creating token...");
  const payload = {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
  };

  const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
  if (!token) {
    throw internalServerErr();
  }
  return token;
};

const authenticateUser = async (identifier, password) => {
  [identifier, password] = [identifier.trim(), password.trim()];

  if (!passwordRegex.test(password)) {
    throw badRequestErr("Invalid password.");
  }

  if (emailRegex.test(identifier) || usernameRegex.test(identifier)) {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      throw internalServerErr("User not found");
    }

    // check if password correct
    if (await bcrypt.compare(password, user.password)) {
      return user;
    } else {
      throw unauthorizedErr("Incorrect password");
    }
  } else {
    throw badRequestErr("Invalid input.");
  }
};

export { createUser, saveUser, createJwtToken, authenticateUser };
