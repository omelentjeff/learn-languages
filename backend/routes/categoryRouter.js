/**
 * @fileoverview This file sets up an Express router for category-related routes.
 * It includes routes for getting all categories, getting categories by language,
 * and posting a new category. These routes interact with the database through
 * the provided database functions.
 */

const database = require("../database/database");
const express = require("express");
const categoryRouter = express.Router();

/**
 * Route to get all categories.
 * On success, returns an array of categories.
 * On error, returns a 500 status code with an error message.
 * @name get/
 * @function
 * @memberof module:categoryRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
categoryRouter.get("/", async (req, res) => {
  try {
    const categories = await database.getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

/**
 * Route to get categories by a specific language.
 * On success, returns an array of categories for the specified language.
 * On error, returns a 500 status code with an error message.
 * @name get/:language
 * @function
 * @memberof module:categoryRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
categoryRouter.get("/:language", async (req, res) => {
  try {
    const categories = await database.getCategoriesById(req.params.language);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

/**
 * Route to post a new category.
 * On success, returns the newly created category.
 * On error, returns a 500 status code with an error message.
 * @name post/
 * @function
 * @memberof module:categoryRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
categoryRouter.post("/", async (req, res) => {
  try {
    const categoryName = req.body.category;
    const newCategory = await database.addNewCategory(categoryName);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

module.exports = categoryRouter;
