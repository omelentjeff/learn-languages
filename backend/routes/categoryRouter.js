const database = require("../database/database");
const express = require("express");
const categoryRouter = express.Router();

categoryRouter.get("/", async (req, res) => {
  try {
    const categories = await database.getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

categoryRouter.get("/:language", async (req, res) => {
  try {
    const categories = await database.getCategoriesById(req.params.language);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

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
