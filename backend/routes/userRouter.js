const database = require("../database/database");
const express = require("express");
const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  try {
    const users = await database.findAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

module.exports = userRouter;
