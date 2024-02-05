const HttpError = require("../helpers/HttpError");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const { JWT_SECRET } = process.env;

const authMiddleware = async (req, res, next) => {
  const authHeaders = req.headers.authorization || "";
  const [type, token] = authHeaders.split("");

  if (type !== "Bearer" || !token) {
    throw HttpError(401, "Not authorized");
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);

    if (!user || user.token !== token) {
      throw new HttpError(401, "Not authorized");
    }
    req.user = user;
    next();
  } catch (error) {
    next(new HttpError(401, "Not authorized"));
  }
};

module.exports = authMiddleware;
