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

module.exports = categoryRouter;
