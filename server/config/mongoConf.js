import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function connect_database() {
  try {
    await mongoose.connect(process.env.DB_ATLAS_URL);
    console.log("MongoDB connection established.");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export default connect_database;
