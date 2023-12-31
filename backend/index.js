const express = require("express");
const languageRouter = require("./routes/languageRoute");
const port = 8080;
const app = express();
const path = require("path");
const mysql = require("mysql");
const config = require("./config");
const connection = mysql.createPool(config);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.json());
app.use("/api/languages", languageRouter);

// app.use(express.static(path.join(__dirname, "../frontend/dist")));

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
