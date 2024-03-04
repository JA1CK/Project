require("dotenv").config();

const verifyAdmin = (req, res, next) => {
  const isAdmin = req.cookies.admin || req.body.isAdmin;

  if (isAdmin == "true") {
    return next();
  } else {
    return res.status(401).send("Unauthorized user");
  }
};

module.exports = verifyAdmin;