/**
 * @fileoverview This file sets up an Express router for language-related routes.
 * It includes routes for getting all languages with word counts, getting a specific language,
 * posting a new language, and deleting a language by its ID. These routes interact with the
 * database through the provided database functions.
 */

const database = require("../database/database");
const express = require("express");
const languageRouter = express.Router();

/**
 * Route to get all languages with their respective word counts.
 * On success, returns an array of languages with word counts.
 * On error, returns a 500 status code with an error message.
 * @name get/
 * @function
 * @memberof module:languageRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
languageRouter.get("/", async (req, res) => {
  try {
    const languagesWithWordCount =
      await database.getAllLanguagesWithWordCount();
    res.json(languagesWithWordCount);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

/**
 * Route to get a specific language by its name.
 * On success, returns the details of the language.
 * On error, returns a 500 status code with an error message or a 404 if the language is not found.
 * @name get/:languageName
 * @function
 * @memberof module:languageRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
languageRouter.get("/:languageName", async (req, res) => {
  try {
    const languageName = req.params.languageName;
    const language = await database.findLanguage(languageName);
    res.json(language);
  } catch (err) {
    if (err.message.includes("not found")) {
      res.status(404).json({ message: "Language not found" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

/**
 * Route to post a new language.
 * On success, returns the newly created language.
 * On error, returns a 500 status code with an error message.
 * @name post/
 * @function
 * @memberof module:languageRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
languageRouter.post("/", async (req, res) => {
  try {
    const language = req.body.language;
    const newLanguage = await database.saveLanguage(language);
    res.status(201).json(newLanguage);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

/**
 * Route to delete a language by its ID.
 * On success, returns a 204 status code.
 * On error, returns a 500 status code with an error message.
 * @name delete/:myId
 * @function
 * @memberof module:languageRouter
 * @inner
 * @param {string} path - Express path with a parameter for the language ID.
 * @param {callback} middleware - Express middleware.
 */
languageRouter.delete("/:myId([0-9]+)", async (req, res) => {
  try {
    const id = parseInt(req.params.myId);
    const result = await database.deleteLanguageById(id);
    res.status(204).json(result);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

module.exports = languageRouter;
