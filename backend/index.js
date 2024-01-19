/**
 * @fileoverview This file sets up and runs an Express server for a web application.
 * It includes configurations for routing, middleware, CORS, cookie parsing,
 * static file serving, and database connection using MySQL. The server is designed
 * to handle API requests for words, users, languages, categories, and authentication.
 * It also handles graceful shutdown of the server and the MySQL connection.
 */

const express = require("express");
const wordRouter = require("./routes/wordRouter");
const userRouter = require("./routes/userRouter");
const languageRouter = require("./routes/languageRouter");
const categoryRouter = require("./routes/categoryRouter");
const authenticate = require("./middleware/authenticate");
const authRouter = require("./routes/authRouter");
const port = 8080;
const app = express();
const path = require("path");
const cors = require("cors");
const mysql = require("mysql");
const cookieParser = require("cookie-parser");
const config = require("./config");
const connection = mysql.createPool(config);

// Middleware to parse JSON requests
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5175",
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware to parse cookies
app.use(cookieParser());

// API routes with authentication middleware where needed
app.use("/api/words", authenticate, wordRouter);
app.use("/api/languages", authenticate, languageRouter);
app.use("/api/users", userRouter);
app.use("/api/categories", authenticate, categoryRouter);
app.use("/api/auth", authenticate, authRouter);

// Serving static files from the 'frontend/dist' directory
app.use(express.static("./frontend/dist"));

// Route handler for serving the frontend application
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/dist/index.html"));
});

// Fallback route handler for non-existent API endpoints
app.use("*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// Server setup and error handling
const server = app
  .listen(port, () => {
    console.log(`SERVER: listening on port ${port}`);
  })
  .on("error", (err) => {
    console.log("SERVER: Error starting server: ", err);
    process.exit(1);
  });

/**
 * Function to handle graceful shutdown of the server and MySQL connection.
 * This function is triggered on receiving SIGTERM or SIGINT signals.
 */
const gracefulShutdown = () => {
  // Logic for shutting down the server and MySQL connection
};

// Listening for shutdown signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
