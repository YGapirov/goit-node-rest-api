const HttpError = require("../helpers/HttpError.js");
const controllerWrapper = require("../helpers/controllerWrapper.js");
const User = require("../models/users.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

const { JWT_SECRET } = process.env;

const register = async (req, res, next) => {
  const { email, password, subscription } = req.body;
  //   const salt = await bcrypt.genSalt(); //можно просто передити стандартні солі(10)
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await User.create({
      email,
      password: hashedPassword,
      subscription,
    });
    res.status(201).json({
      user: {
        email,
        subscription: result.subscription,
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

module.exports = {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
  logout: controllerWrapper(logout),
  getCurrent: controllerWrapper(getCurrent),
};
