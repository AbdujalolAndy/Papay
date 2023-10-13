const mongoose = require("mongoose");
const http = require("http");
const env = require("dotenv");
env.config();

const databaseConnection = process.env.MONGODB_URL;

mongoose
  .connect(databaseConnection)
  .then((data) => {
    console.log("Successfully connection to Mongodb Database");
    const app = require("./app");
    const server = http.createServer(app);
    const port = process.env.PORT ?? 3010;
    server.listen(
      port,
      console.info(
        `Server is listening on port ${port}`,
        `http://localhost:${port}`
      )
    );
  })
  .catch((err) => {
    console.log("Something went wrong", err.message);
  });
