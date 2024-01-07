const database = require("../database/database");
const { validateResult } = require("../utils/validation");
const express = require("express");
const languageRouter = express.Router();

languageRouter.get("/:language", async (req, res) => {
  try {
    const language = req.params.language;
    const languageInfo = await database.findLanguage(language);
    const wordCount = await database.getWordCountForLanguage(language);

    const responseData = {
      language: languageInfo,
      wordCount: wordCount,
    };

    res.json(responseData);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

module.exports = languageRouter;
