const express = require("express");
const authRouter = express.Router();
const validateBody = require("../helpers/validateBody.js");
const { register, login } = require("../controllers/usersController");
const {
  registerUserSchema,
  loginUserSchema,
} = require("../schemas/userSchemas.js");

authRouter.post("/register", validateBody(registerUserSchema), register);
authRouter.post("/login", validateBody(loginUserSchema), login);

module.exports = authRouter;
