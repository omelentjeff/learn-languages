const database = require("../database/database");
const express = require("express");
const languageRouter = express.Router();

languageRouter.get("/", async (req, res) => {
  const words = await database.findAll();
  res.json(words);
});
