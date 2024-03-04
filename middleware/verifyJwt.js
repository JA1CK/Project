const jwt = require("jsonwebtoken");

require("dotenv").config();
const tokenKey = process.env.TOKEN_KEY;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, tokenKey);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};

module.exports = verifyToken;
