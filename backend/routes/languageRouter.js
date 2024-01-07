const database = require("../database/database");
const { validateResult } = require("../utils/validation");
const express = require("express");
const languageRouter = express.Router();

languageRouter.get("/:language", async (req, res) => {
  const language = req.params.language;
  const words = await database.findLanguage(language);
  res.json(words);
});

module.exports = languageRouter;
