const database = require("../database/database");
const express = require("express");
const languageRouter = express.Router();

languageRouter.get("/", async (req, res) => {
  const words = await database.findAll();
  res.json(words);
});

languageRouter.post("/", async (req, res) => {
  try {
    const newWord = await database.save(req.body);
    res.status(201).json(newWord);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

module.exports = languageRouter;
