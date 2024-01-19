/**
 * @fileoverview This file provides a function for creating JSON Web Tokens (JWTs).
 * The function takes a user object as input and generates a token based on the
 * user's ID and role. The token is signed with a secret key and configured to
 * expire in 24 hours.
 */

const jwt = require("jsonwebtoken");

/**
 * Creates a JSON Web Token (JWT) for a user.
 *
 * The token includes the user's ID and role as payload and is signed with a secret key.
 * The token is set to expire in 24 hours.
 *
 * @param {Object} user - The user object for which the token is being created.
 * @param {number} user.user_id - The unique ID of the user.
 * @param {string} user.role - The role of the user.
 * @returns {string} A JWT as a string.
 */
const createToken = (user) => {
  return jwt.sign(
    {
      id: user.user_id,
      role: user.role,
    },
    process.env.SECRET,
    { expiresIn: "24h" }
  );
};

module.exports = { createToken };
