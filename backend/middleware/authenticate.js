/**
 * @fileoverview This file provides middleware for authenticating requests using JSON Web Tokens (JWT).
 * The middleware checks for a JWT in the request cookies and verifies it. If the token is valid,
 * the request is allowed to proceed; otherwise, an error response is sent.
 */

const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

/**
 * Middleware to authenticate requests using JWT.
 * Checks for a 'jwt' cookie in the request, verifies it, and either forwards the request to the next middleware
 * or sends an unauthorized response.
 *
 * @param {Object} req - The request object from Express.js.
 * @param {Object} res - The response object from Express.js.
 * @param {Function} next - The next middleware function in the Express.js route.
 */
const authenticate = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        console.error("JWT Verification Error:", err);
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
