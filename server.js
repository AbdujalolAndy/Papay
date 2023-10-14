const mongoose = require("mongoose");
const http = require("http");
const env = require("dotenv");
const color = require('colors/safe')

env.config();

const databaseConnection = process.env.MONGODB_URL;

mongoose
  .connect(databaseConnection)
  .then((data) => {
    console.log(color.blue("Successfully connection to Mongodb Database"));
    const app = require("./app");
    const server = http.createServer(app);
    const port = process.env.PORT ?? 3010;
    server.listen(
      port,
      console.info(
        color.yellow(`Server is listening on port ${port}`),
        color.rainbow(`http://localhost:${port}`)
      )
    );
  })
  .catch((err) => {
    console.log(color.red("Something went wrong", err.message));
  });
