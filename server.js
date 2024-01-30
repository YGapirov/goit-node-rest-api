const mongoose = require("mongoose");
// const config = require("config");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config();
const { DB_HOST } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log("Database connection successful");
    });
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
