import express from "express";
import dotenv from "dotenv";
import connect_database from "./config/mongoConf.js";
import routerNode from "./api/_index.js";
import morgan from "morgan";
import cors from "cors";

// dotenv
dotenv.config();

// Server instance
const app = express();
const port = process.env.PORT;

// morgan log
morgan.token("customDate", () => {
  const currentDate = new Date().toISOString();
  return currentDate;
});
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :customDate"
  )
);

// CORS
const cors_options = {
  origin: [
    `http://localhost:${process.env.CLIENT_PORT}`,
    "http://localhost:5173/",
  ],
  optionsSuccessStatus: 200,
};
// app.use(cors(cors_options));
app.use(cors());

// JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing
routerNode(app);

// Server main
(async () => {
  try {
    await connect_database();
    app.listen(port, () => {
      console.log(`Started running port at`, port);
    });
  } catch (error) {
    console.log("Issue connecting to server/mongodb.", error);
  }
})();
