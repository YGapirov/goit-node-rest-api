const HttpError = require("../helpers/HttpError.js");
const controllerWrapper = require("../helpers/controllerWrapper.js");
const User = require("../models/users.js");
const bcrypt = require("bcrypt");

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

  res.json({ token: "<Token>" });
};

module.exports = {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
};
