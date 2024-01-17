const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

const authenticate = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Unauthorized" });
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

module.exports = authenticate;
