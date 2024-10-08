/**
 * @fileoverview This file sets up an Express router for user-related routes.
 * It includes routes for getting all users, user signup, user login, and getting the role of the logged-in user.
 * These routes interact with the database and include authentication and password hashing functionalities.
 */

const database = require("../database/database");
const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/jwt");
const authenticate = require("../middleware/authenticate");

/**
 * Route to get all users.
 * On success, returns an array of users.
 * On error, returns a 500 status code with an error message.
 * @name get/
 * @function
 * @memberof module:userRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
userRouter.get("/", async (req, res) => {
  try {
    const users = await database.findAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

/**
 * Route for user signup.
 * On success, creates a new user and returns user details with a token.
 * On error, returns a 500 status code with an error message or a 400 if the username is already in use.
 * @name post/signup
 * @function
 * @memberof module:userRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
userRouter.post("/signup", async (req, res) => {
  try {
    const existingUser = await database.findUserByUsername(req.body.username);

    if (existingUser !== null) {
      return res.status(400).json("Username already in use!");
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = await database.saveUser(
        req.body.username,
        hashedPassword,
        req.body.role || false
      );

      const addedUser = await database.findUserByUsername(req.body.username);
      const { user_id, username, role } = addedUser;
      const token = createToken(addedUser);

      res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "Strict",
      });

      res.status(200).json({ user_id, username, role, token: token });
    }
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

/**
 * Route for user login.
 * On success, authenticates the user and returns user details with a token.
 * On error, returns a 500 status code with an error message, a 400 if the user is not found, or a 401 if the password is incorrect.
 * @name post/login
 * @function
 * @memberof module:userRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
userRouter.post("/login", async (req, res) => {
  try {
    const foundUser = await database.findUserByUsername(req.body.username);

    if (foundUser === null) {
      return res.status(400).json(`User (${req.body.username}) not found`);
    } else {
      const isPasswordMatch = await bcrypt.compare(
        req.body.password,
        foundUser.password_hash
      );

      if (isPasswordMatch) {
        const { user_id, username, role } = foundUser;
        const token = createToken(foundUser);

        res.cookie("jwt", token, {
          httpOnly: true,
          sameSite: "Strict",
        });

        res.status(200).json({ user_id, username, role, token: token });
      } else {
        res.status(401).json("Incorrect password");
      }
    }
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

/**
 * Route to get the role of the currently authenticated user.
 * Requires authentication middleware.
 * On success, returns the user's role.
 * On error, returns a 403 status code if the user's role is not found.
 * @name get/role
 * @function
 * @memberof module:userRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
userRouter.get("/role", authenticate, (req, res) => {
  if (req.user) {
    return res.status(200).json({ role: req.user.role });
  } else {
    return res.status(403).send("User role not found");
  }
});

module.exports = userRouter;
