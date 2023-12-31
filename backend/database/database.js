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
};
