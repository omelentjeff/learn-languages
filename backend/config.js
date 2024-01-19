/**
 * @fileoverview This file defines the configuration for a MySQL database connection.
 * It utilizes environment variables to set up various connection parameters. This
 * configuration includes parameters such as the host, user, password, database name,
 * connection limit, and the ability to execute multiple statements. The use of
 * environment variables enhances security and flexibility, allowing for the configuration
 * to be easily changed without modifying the codebase.
 */

// Importing the dotenv package to use environment variables from a .env file
require("dotenv").config();

/**
 * Database configuration object
 * @typedef {Object} DbConfig
 * @property {number} connectionLimit - The maximum number of connections to create at once.
 * @property {string} host - The hostname of the database server.
 * @property {string} user - The username for the database connection.
 * @property {string} password - The password for the database connection.
 * @property {string} database - The name of the database to connect to.
 * @property {boolean} multipleStatements - Allows for multiple SQL statements per query.
 */

/**
 * The configuration object for connecting to a MySQL database.
 * @type {DbConfig}
 */
const config = {
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  multipleStatements: true,
};

// Exporting the configuration object for use in other parts of the application
module.exports = config;
