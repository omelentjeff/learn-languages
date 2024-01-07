const database = require("../database/database");
const { validateResult } = require("../utils/validation");
const express = require("express");
const languageRouter = express.Router();

languageRouter.get("/", async (req, res) => {
  try {
    const languagesWithWordCount =
      await database.getAllLanguagesWithWordCount();
    res.json(languagesWithWordCount);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

module.exports = languageRouter;
