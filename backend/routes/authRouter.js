/**
 * @fileoverview This file sets up an Express router for authentication-related routes.
 * Currently, it includes the route for logging out a user. The logout functionality is
 * implemented by setting the 'jwt' cookie to an empty string and a max age of 1 millisecond,
 * effectively removing the cookie.
 */

const express = require("express");
const authRouter = express.Router();

/**
 * Route for logging out a user.
 * This route clears the 'jwt' cookie by setting its value to an empty string and its maxAge to 1 millisecond.
 * @name post/logout
 * @function
 * @memberof module:authRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
authRouter.post("/logout", (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, maxAge: 1 });
  res.status(200).send("Logged out successfully");
});

module.exports = authRouter;
