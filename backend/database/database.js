const { hash } = require("bcrypt");
const mysql = require("mysql");
const { user } = require("../config");
const config = require("../config");
const pool = mysql.createPool(config);

module.exports = {
  findAll: (language) => {
    return new Promise((resolve, reject) => {
      const tableName = `${language}`;
      pool.query(`SELECT * FROM words`, (err, result) => {
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
    const sql = `SELECT * FROM words WHERE word_id = ${id} AND language_id = (SELECT language_id FROM languages WHERE language_name = '${language}')`;

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

  findAllUsers: () => {
    const sql = "SELECT * FROM users";
    return new Promise((resolve, reject) => {
      pool.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  saveUser: (username, hashedPassword, role) => {
    const sql =
      "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)";
    const values = [username, hashedPassword, role];

    return new Promise((resolve, reject) => {
      pool.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve("User added successfully");
        }
      });
    });
  },

  // ...

  findUserByUsername: (username) => {
    const sql =
      "SELECT user_id, username, password_hash FROM users WHERE username = ?";
    const values = [username];

    return new Promise((resolve, reject) => {
      pool.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.length > 0 ? result[0] : null);
        }
      });
    });
  },

  // ...
};
