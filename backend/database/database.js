const { hash } = require("bcrypt");
const mysql = require("mysql");
const { user } = require("../config");
const config = require("../config");
const pool = mysql.createPool(config);

module.exports = {
  findAll: () => {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM words`, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  findAllWordsByLanguage: (language) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT words.*, categories.category_name FROM words JOIN categories ON words.category_id = categories.category_id WHERE words.language_id = (SELECT language_id FROM languages WHERE language_name = ?)",
        [language],
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
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
      category,
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

  updateWord: (wordId, updates) => {
    const updatePromises = Object.keys(updates).map(async (field) => {
      const value = updates[field];
      const sql = `UPDATE words SET ${field} = ? WHERE word_id = ?`;
      const values = [value, wordId];

      return new Promise((resolve, reject) => {
        pool.query(sql, values, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    });

    return Promise.all(updatePromises);
  },

  deleteWordById: (id) => {
    const sql = "DELETE FROM words WHERE word_id = ?";
    const values = [id];

    return new Promise((resolve, reject) => {
      pool.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  getWordsByLanguageAndCategories: (language, categories) => {
    const placeholders = categories.map(() => "?").join(", ");
    const sql = `
      SELECT word_id, foreign_word, finnish_word 
      FROM words 
      WHERE 
        language_id = (SELECT language_id FROM languages WHERE language_name = ?) 
        AND category_id IN (${placeholders});
    `;

    return new Promise((resolve, reject) => {
      pool.query(sql, [language, ...categories], (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
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
      "SELECT user_id, username, password_hash, role FROM users WHERE username = ?";
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

  findLanguage: (language) => {
    const sql = "SELECT * FROM languages WHERE language_name = ?";
    const values = [language];

    return new Promise((resolve, reject) => {
      pool.query(sql, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length === 0) {
            reject(new Error(`Language: (${language}) not found`));
          } else {
            resolve(results[0]);
          }
        }
      });
    });
  },

  getAllLanguagesWithWordCount: () => {
    const sql = `
      SELECT 
        languages.language_id,
        languages.language_name,
        COUNT(words.word_id) AS wordCount
      FROM languages
      LEFT JOIN words ON languages.language_id = words.language_id
      GROUP BY languages.language_id, languages.language_name
    `;
    const values = [];

    return new Promise((resolve, reject) => {
      pool.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  saveLanguage: (language) => {
    const sql = "INSERT INTO languages (language_name) VALUES (?)";
    const values = [language];

    return new Promise((resolve, reject) => {
      pool.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          const insertedLanguageId = result.insertId;

          const selectSql = "SELECT * FROM languages WHERE language_id = ?";
          pool.query(
            selectSql,
            [insertedLanguageId],
            (selectErr, selectResult) => {
              if (selectErr) {
                reject(selectErr);
              } else {
                resolve(selectResult[0]);
              }
            }
          );
        }
      });
    });
  },

  deleteLanguageById: (id) => {
    const sql = "DELETE FROM languages WHERE language_id = ?";
    const values = [id];

    return new Promise((resolve, reject) => {
      pool.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  getAllCategories: () => {
    const sql = "SELECT * FROM categories";

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

  addNewCategory: (categoryName) => {
    const sql = "INSERT INTO categories (category_name) VALUES (?)";
    const values = [categoryName];

    return new Promise((resolve, reject) => {
      pool.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  getCategoriesById: (language) => {
    const sql =
      "SELECT DISTINCT categories.category_id, categories.category_name FROM categories JOIN words ON categories.category_id = words.category_id JOIN languages ON words.language_id = languages.language_id WHERE languages.language_name = ?";
    const values = [language];

    return new Promise((resolve, reject) => {
      pool.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
};
