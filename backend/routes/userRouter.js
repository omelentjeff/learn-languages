const database = require("../database/database");
const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");

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
        hashedPassword
      );
      res.status(201).json(newUser);
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
        const { user_id, username } = foundUser;
        res.status(200).json({ user_id, username });
      } else {
        res.status(401).json("Incorrect password");
      }
    }
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

module.exports = userRouter;
