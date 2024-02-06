const express = require("express");
const { register, login, logout, getCurrent, updateSub } = require("../controllers/usersController");
const { registerUserSchema, loginUserSchema, updateSubSchema } = require("../schemas/userSchemas.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const validateBody = require("../middlewares/validateBody.js");
const isValidId = require("../middlewares/isValidId.js");

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerUserSchema), register);
authRouter.post("/login", validateBody(loginUserSchema), login);
authRouter.get("/current", authMiddleware, getCurrent);
authRouter.post("/logout", authMiddleware, logout);
authRouter.post("/logout", authMiddleware, logout);
authRouter.patch("/:id/subscription", authMiddleware, isValidId, validateBody(updateSubSchema), updateSub);

module.exports = authRouter;
