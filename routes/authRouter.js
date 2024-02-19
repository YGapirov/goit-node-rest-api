const express = require("express");
const { register, login, logout, getCurrent, updateSub, updateAvatar, verify, resendVerify } = require("../controllers/usersController");
const { registerUserSchema, loginUserSchema, updateSubSchema, emailSchema } = require("../schemas/userSchemas.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const validateBody = require("../middlewares/validateBody.js");
const upload = require("../middlewares/upload");

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerUserSchema), register);
authRouter.get("/verify/:verificationToken", verify);
authRouter.post("/verify", validateBody(emailSchema), resendVerify);

authRouter.post("/login", validateBody(loginUserSchema), login);
authRouter.get("/current", authMiddleware, getCurrent);
authRouter.post("/logout", authMiddleware, logout);
authRouter.patch("/subscription", authMiddleware, validateBody(updateSubSchema), updateSub);
authRouter.patch("/avatars", authMiddleware, upload.single("avatarURL"), updateAvatar);

module.exports = authRouter;
