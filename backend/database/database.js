const mysql = require("mysql");
const config = require("../config");
const pool = mysql.createPool(config);

module.exports = {
  findAll: () => {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM english`, (err, words) => {
        if (err) {
          reject(err);
        }
        resolve(words);
      });
    });
  },

  save: (query) => {
    const sql = "INSERT INTO english (english, finnish) VALUES (?, ?)";
    const values = [query.english, query.finnish];

    return new Promise((resolve, reject) => {
      pool.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve("Added a word pair");
        }
      });
    });
  },
};
