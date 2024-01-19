/**
 * @fileoverview This file sets up an Express router for word-related routes.
 * It includes routes for getting all words, getting words by language, adding new words,
 * updating words, validating words, and deleting words. These routes interact with the
 * database and include functionalities for word management.
 */

const database = require("../database/database");
const { validateResult } = require("../utils/validation");
const express = require("express");
const wordRouter = express.Router();

/**
 * Route to get all words.
 * On success, returns an array of words.
 * On error, returns a 500 status code with an error message.
 * @name get/
 * @function
 * @memberof module:wordRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
wordRouter.get("/", async (req, res) => {
  const words = await database.findAll();
  res.json(words);
});

/**
 * Route to get words by a specific language.
 * On success, returns an array of words for the specified language.
 * On error, returns a 500 status code with an error message.
 * @name get/:language
 * @function
 * @memberof module:wordRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
wordRouter.get("/:language", async (req, res) => {
  try {
    const language = req.params.language;
    const words = await database.findAllWordsByLanguage(language);
    res.json(words);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

/**
 * Route to post a new word in a specific language.
 * On success, returns the newly created word.
 * On error, returns a 500 status code with an error message.
 * @name post/:language
 * @function
 * @memberof module:wordRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
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

/**
 * Route to update a word by its ID.
 * On success, returns the updated word.
 * On error, returns a 500 status code with an error message or a 400 for invalid data.
 * @name put/:wordId
 * @function
 * @memberof module:wordRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
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

/**
 * Route to validate a word by its ID.
 * On success, returns a success message if validation passes.
 * On error, returns a 500 status code with an error message or a 400 for failed validation.
 * @name post/validate/:myId
 * @function
 * @memberof module:wordRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
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

/**
 * Route to delete a word by its ID.
 * On success, returns a 204 status code.
 * On error, returns a 500 status code with an error message.
 * @name delete/:myId
 * @function
 * @memberof module:wordRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
wordRouter.delete("/:myId([0-9]+)", async (req, res) => {
  try {
    const id = parseInt(req.params.myId);
    const result = await database.deleteWordById(id);
    res.status(204).json(result);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

/**
 * Route to get words filtered by language and categories.
 * On success, returns an array of words.
 * On error, returns a 500 status code with an error message.
 * @name post/
 * @function
 * @memberof module:wordRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
wordRouter.post("/", async (req, res) => {
  try {
    const language = req.body.language;
    const categories = req.body.categories;
    const words = await database.getWordsByLanguageAndCategories(
      language,
      categories
    );
    res.json(words);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

module.exports = wordRouter;
