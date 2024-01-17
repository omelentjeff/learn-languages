const express = require("express");
const authRouter = express.Router();

authRouter.post("/logout", (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, maxAge: 1 });
  res.status(200).send("Logged out successfully");
});

module.exports = authRouter;
