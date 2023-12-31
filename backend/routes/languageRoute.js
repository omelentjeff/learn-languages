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

const validateResult = (query, result) => {
  const userWord = Object.values(query)[0].toLowerCase();
  const correctWord = Object.values(result)[0].finnish.toLowerCase();
  if (userWord === correctWord) {
    return true;
  } else {
    return false;
  }
};

languageRouter.post("/:language/validate/:myId([0-9]+)", async (req, res) => {
  try {
    const language = req.params.language;
    const id = parseInt(req.params.myId);

    const result = await database.findById(language, id);

    const isValid = validateResult(req.body, result);

    if (isValid) {
      res.status(200).json("Verification successful");
    } else {
      res.status(400).json({ msg: "Validation failed" });
    }
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

module.exports = languageRouter;
