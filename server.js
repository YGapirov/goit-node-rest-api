const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
const app = require("./app");

dotenv.config();
const { DB_HOST } = process.env;

// const JWT_SECRET = "WARNING secret information";
// async function main() {
//   const payload = { id: "asdasdasdasdasdasd", email: "dg@mail.com" };
//   const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "15s" });
//   console.log({ token });

//   try {
//     const isValid = jwt.verify(token, JWT_SECRET);
//     console.log({ isValid });
//   } catch (error) {
//     console.error("Not authorized", error);
//   }

//   //expired error

//   try {
//     const expiredToken =
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFzZGFzZGFzZGFzZGFzZGFzZCIsImVtYWlsIjoiZGdAbWFpbC5jb20iLCJpYXQiOjE3MDcxNjI3NTcsImV4cCI6MTcwNzE2Mjc3Mn0.I7duVM8Zk5Y7YFUrJV3F8xZVgS00pbnbJrzBxRKkoPI";
//     const isExpired = jwt.verify(expiredToken, JWT_SECRET);
//     console.log({ isExpired });
//   } catch (error) {
//     console.error("Not authorized", error);
//   }
// }
// main();

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
