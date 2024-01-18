const database = require("../database/database");
const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/jwt");
const authenticate = require("../middleware/authenticate");

userRouter.get("/", async (req, res) => {
  try {
    const users = await database.findAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

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

userRouter.get("/role", authenticate, (req, res) => {
  if (req.user) {
    return res.status(200).json({ role: req.user.role });
  } else {
    return res.status(403).send("User role not found");
  }
});

module.exports = userRouter;
