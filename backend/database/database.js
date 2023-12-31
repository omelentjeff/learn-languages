const mysql = require("mysql");
const config = require("../config");
const pool = mysql.createPool(config);

module.exports = {
  findAll: (language) => {
    return new Promise((resolve, reject) => {
      const tableName = `${language}`;
      pool.query(`SELECT * FROM ${tableName}`, (err, words) => {
        if (err) {
          reject(err);
        }
        resolve(words);
      });
    });
  },

  save: (language, query) => {
    const tableName = `${language}`;
    const sql = `INSERT INTO ${tableName} (${language}, finnish) VALUES (?, ?)`;
    const values = Object.values(query);

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
