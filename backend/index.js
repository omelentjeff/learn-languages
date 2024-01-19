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

app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5175",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use("/api/words", authenticate, wordRouter);
app.use("/api/languages", authenticate, languageRouter);
app.use("/api/users", userRouter);
app.use("/api/categories", authenticate, categoryRouter);
app.use("/api/auth", authenticate, authRouter);

app.use(express.static("./frontend/dist"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/dist/index.html"));
});

app.use("*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

const server = app
  .listen(port, () => {
    console.log(`SERVER: listening on port ${port}`);
  })
  .on("error", (err) => {
    console.log("SERVER: Error starting server: ", err);
    process.exit(1);
  });

const gracefulShutdown = () => {
  console.log("Starting graceful shutdown...");
  // Close the server
  if (server) {
    console.log("Server was opened, so we can close it...");
    server.close((err) => {
      if (err) {
        console.log("SERVER: Error closing Express server: ", err);
      } else {
        console.log("SERVER: stopped.");
      }

      console.log("MYSQL: Starting graceful shutdown...");
      connection.end((err) => {
        if (err) {
          console.log("MYSQL: Error closing MYSQL connection: ", err);
        } else {
          console.log("MYSQL: Connection closed.");
        }

        console.log("Application: Shutdown complete");
        process.exit(0);
      });
    });
  }
};

process.on("SIGTERM", gracefulShutdown); // Some other app requirest shutdown.
process.on("SIGINT", gracefulShutdown); // ctrl-c
