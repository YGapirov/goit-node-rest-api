const HttpError = require("../helpers/HttpError.js");
const controllerWrapper = require("../helpers/controllerWrapper.js");
const User = require("../models/users.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const gravatar = require("gravatar");
var Jimp = require("jimp");

const dotenv = require("dotenv");
dotenv.config();

const { JWT_SECRET } = process.env;

const register = async (req, res, next) => {
  const { email, password, subscription } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  try {
    const result = await User.create({ email, password: hashedPassword, subscription, avatarURL });
    res.status(201).json({
      user: {
        email,
        subscription: result.subscription,
        avatarURL: result.avatarURL,
      },
    });
  } catch (error) {
    if (error.message.includes("E11000")) {
      throw HttpError(409, "Email in use");
    }
    throw error;
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }); //шукаємо по пошті користувача

  if (!user) {
    throw HttpError(401, "Email or password is wrong"); //якщо нема в базі еррор
  }

  const isValidPassword = await bcrypt.compare(password, user.password); //перевіряємо коректність паролю
  if (!isValidPassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign({ payload }, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token }); //додаєм токен в базу даних

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const updateSub = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { filename } = req.file;

  const tmpPath = path.resolve("tmp", filename);
  const publicPath = path.resolve("public", "avatars", filename);

  //адаптація розміру
  const image = await Jimp.read(tmpPath);
  await image.resize(250, 250).write(tmpPath);

  await fs.rename(tmpPath, publicPath); //переміщення

  const result = await User.findByIdAndUpdate(_id, { avatarURL: publicPath }, { new: true });
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json({ avatarURL: result.avatarURL });
};

module.exports = {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
  logout: controllerWrapper(logout),
  getCurrent: controllerWrapper(getCurrent),
  updateSub: controllerWrapper(updateSub),
  updateAvatar: controllerWrapper(updateAvatar),
};
