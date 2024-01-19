/**
 * @fileoverview This module provides database access functions for a web application.
 * It contains methods for querying, inserting, updating, and deleting records in various
 * tables, such as words, users, languages, and categories. Each function is designed to
 * return a promise, facilitating asynchronous database operations.
 */

const { hash } = require("bcrypt");
const mysql = require("mysql");
const { user } = require("../config");
const config = require("../config");
const pool = mysql.createPool(config);

module.exports = {
  /**
   * Retrieves all words from the database.
   * @returns {Promise<Array>} A promise that resolves with an array of words.
   */
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

  /**
   * Finds all words associated with a given language.
   * @param {string} language - The language to filter words by.
   * @returns {Promise<Array>} A promise that resolves with an array of words.
   */
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

  /**
   * Inserts a new word into the database, ensuring no duplicates for the combination of language and category.
   * @param {string} language - The language of the word.
   * @param {string} category - The category of the word.
   * @param {Object} query - An object containing the foreign and Finnish words.
   * @returns {Promise<string>} A promise that resolves with a success message.
   */
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

  /**
   * Updates a word in the database.
   * @param {number} wordId - The ID of the word to be updated.
   * @param {Object} updates - An object containing the fields to be updated.
   * @returns {Promise<Array>} A promise that resolves with the results of the update operations.
   */
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

  /**
   * Deletes a word from the database by its ID.
   * @param {number} id - The ID of the word to be deleted.
   * @returns {Promise<Object>} A promise that resolves with the result of the deletion.
   */
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

  /**
   * Retrieves words filtered by language and categories.
   * @param {string} language - The language of the words.
   * @param {Array<string>} categories - The categories to filter the words by.
   * @returns {Promise<Array>} A promise that resolves with an array of words.
   */
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

  /**
   * Finds a word by its ID in a specific language.
   * @param {string} language - The language of the word.
   * @param {number} id - The ID of the word.
   * @returns {Promise<Object>} A promise that resolves with the word details.
   */
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

  /**
   * Retrieves all users from the database.
   * @returns {Promise<Array>} A promise that resolves with an array of users.
   */
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

  /**
   * Inserts a new user into the database.
   * @param {string} username - The username of the new user.
   * @param {string} hashedPassword - The hashed password of the new user.
   * @param {string} role - The role of the new user.
   * @returns {Promise<string>} A promise that resolves with a success message.
   */
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

  /**
   * Finds a user by their username.
   * @param {string} username - The username to search for.
   * @returns {Promise<Object|null>} A promise that resolves with the user object or null if not found.
   */
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

  /**
   * Retrieves details of a specific language from the database.
   * @param {string} language - The name of the language to search for.
   * @returns {Promise<Object>} A promise that resolves with the language details.
   */
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

  /**
   * Retrieves all languages along with their respective word count from the database.
   * @returns {Promise<Array>} A promise that resolves with an array of languages and their word counts.
   */
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

  /**
   * Inserts a new language into the database.
   * @param {string} language - The name of the language to be added.
   * @returns {Promise<Object>} A promise that resolves with the details of the inserted language.
   */
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

  /**
   * Deletes a language from the database by its ID.
   * @param {number} id - The ID of the language to be deleted.
   * @returns {Promise<Object>} A promise that resolves with the result of the deletion.
   */
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

  /**
   * Retrieves all categories from the database.
   * @returns {Promise<Array>} A promise that resolves with an array of categories.
   */
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

  /**
   * Adds a new category to the database.
   * @param {string} categoryName - The name of the category to be added.
   * @returns {Promise<Object>} A promise that resolves with the result of the insertion.
   */
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

  /**
   * Retrieves categories by language.
   * @param {string} language - The language to filter categories by.
   * @returns {Promise<Array>} A promise that resolves with an array of categories related to the specified language.
   */
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
