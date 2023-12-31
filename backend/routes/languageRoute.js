const database = require("../database/database");
const express = require("express");
const languageRouter = express.Router();

languageRouter.get("/:language", async (req, res) => {
  const language = req.params.language;
  const words = await database.findAll(language);
  res.json(words);
});

languageRouter.post("/:language", async (req, res) => {
  try {
    const language = req.params.language;
    const newWord = await database.save(language, req.body); // Pass the language parameter
    res.status(201).json(newWord);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

module.exports = languageRouter;
