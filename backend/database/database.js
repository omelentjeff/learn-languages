const mysql = require("mysql");
const config = require("../config");
const pool = mysql.createPool(config);

module.exports = {
  findAll: (language) => {
    return new Promise((resolve, reject) => {
      const tableName = `${language}`;
      pool.query(`SELECT * FROM ${tableName}`, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
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

  findById: (language, id) => {
    const tableName = `${language}`;
    const sql = `SELECT * FROM ${tableName} WHERE id = ?`;

    return new Promise((resolve, reject) => {
      pool.query(sql, [id], (err, result) => {
        if (err) {
          reject("noup");
        }

        if (result.length === 0) {
          reject(`ID (${id}) not found.`);
        } else {
          resolve(result);
          console.log("okei");
        }
      });
    });
  },
};
