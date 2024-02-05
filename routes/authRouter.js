const express = require("express");
const validateBody = require("../middlewares/validateBody.js");
const {
  register,
  login,
  logout,
  getCurrent,
} = require("../controllers/usersController");
const {
  registerUserSchema,
  loginUserSchema,
} = require("../schemas/userSchemas.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerUserSchema), register);
authRouter.post("/login", validateBody(loginUserSchema), login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.post("/current", authMiddleware, getCurrent);

module.exports = authRouter;
