const database = require("../database/database");
const { validateResult } = require("../utils/validation");
const express = require("express");
const wordRouter = express.Router();

wordRouter.get("/", async (req, res) => {
  const words = await database.findAll();
  res.json(words);
});

wordRouter.get("/:language", async (req, res) => {
  try {
    const language = req.params.language;
    const words = await database.findAllWordsByLanguage(language);
    res.json(words);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

wordRouter.post("/:language", async (req, res) => {
  try {
    const language = req.params.language;
    const category = req.body.category;
    const newWord = await database.save(language, category, req.body);
    res.status(201).json(newWord);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

wordRouter.put("/:wordId", async (req, res) => {
  try {
    const wordId = parseInt(req.params.wordId);

    if (!req.body || !Object.keys(req.body).length) {
      return res.status(400).json({ msg: "Invalid data for update" });
    }

    // Map category_name to category_id if it's present
    if (req.body.category_name) {
      const category = await database.getCategoryByName(req.body.category_name);
      if (category) {
        req.body.category_id = category.category_id;
        delete req.body.category_name; // Remove category_name if present
      }
    }

    const updatedWord = await database.updateWord(wordId, req.body);
    res.status(200).json(updatedWord);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

wordRouter.post("/validate/:myId([0-9]+)", async (req, res) => {
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

wordRouter.delete("/:myId([0-9]+)", async (req, res) => {
  try {
    const id = parseInt(req.params.myId);
    const result = await database.deleteWordById(id);
    res.status(204).json(result);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

module.exports = wordRouter;
