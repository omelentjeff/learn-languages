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

userRouter.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Attempt to save the user
    try {
      const newUser = await database.saveUser(
        req.body.username,
        hashedPassword
      );
      res.status(201).json(newUser);
    } catch (error) {
      if (error.message === "Username is already taken") {
        res.status(400).json({
          msg: "Username is already taken. Please choose a different one.",
        });
      } else {
        res.status(500).json({ msg: "Internal server error" });
      }
    }
  } catch (err) {
    res.status(500).json({ msg: err.message || "Internal server error" });
  }
});

module.exports = userRouter;
