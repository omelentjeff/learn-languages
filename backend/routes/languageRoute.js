const database = require("../database/database");
const { validateResult } = require("../utils/validation");
const express = require("express");
const languageRouter = express.Router();

languageRouter.get("/", async (req, res) => {
  const language = req.params.language;
  const words = await database.findAll(language);
  res.json(words);
});

languageRouter.post("/:language", async (req, res) => {
  try {
    const language = req.params.language;
    const category = req.query.category;
    console.log(category);
    const newWord = await database.save(language, category, req.body);
    res.status(201).json(newWord);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

languageRouter.post("/validate/:myId([0-9]+)", async (req, res) => {
  try {
    const language = req.body.language;
    const id = parseInt(req.params.myId);

    const result = await database.findById(language, id);

    const isValid = validateResult(req.body.finnish_word, result);

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
