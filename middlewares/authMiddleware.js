const HttpError = require("../helpers/HttpError");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const { JWT_SECRET } = process.env;

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  //   console.log(authorization);
  if (!authorization) {
    throw HttpError(401, "Not authorized");
  }

  const [bearer, token] = authorization.split(" "); //перевіряєм чи авторизвоаний юзер
  if (bearer !== "Bearer") {
    return next(HttpError(401, "Not authorized"));
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET); //валідуєм токен
    const user = await User.findById(id);

    if (!user) {
      return next(HttpError(401, "Not authorized"));
    }

    req.user = user;

    next();
  } catch (error) {
    return next(HttpError(401, "Not authorized"));
  }
};

module.exports = authMiddleware;
