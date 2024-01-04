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

  save: (language, category, query) => {
    const sql = `
      INSERT INTO languages (language_name) VALUES (?)
      ON DUPLICATE KEY UPDATE language_name = language_name;
  
      INSERT INTO categories (category_name) VALUES (?)
      ON DUPLICATE KEY UPDATE category_name = category_name;
  
      INSERT INTO words (language_id, category_id, foreign_word, finnish_word) 
      SELECT l.language_id, c.category_id, ?, ? 
      FROM languages l
      JOIN categories c ON c.category_name = ?
      WHERE l.language_name = ?
      ON DUPLICATE KEY UPDATE
        language_id = VALUES(language_id),
        category_id = VALUES(category_id),
        foreign_word = VALUES(foreign_word),
        finnish_word = VALUES(finnish_word);
    `;

    const values = [
      language,
      category,
      query.foreign_word,
      query.finnish_word,
      category, // Ensure that the correct value is provided for the category
      language,
    ];

    return new Promise((resolve, reject) => {
      pool.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve("Successfully created a word pair");
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
          reject(err);
        }

        if (result.length === 0) {
          reject(`ID (${id}) not found.`);
        } else {
          resolve(result);
        }
      });
    });
  },
};
