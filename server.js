const mongoose = require("mongoose");
const http = require("http");
const env = require("dotenv");
const color = require("colors/safe");

env.config();

const databaseConnection = process.env.MONGODB_URL;

mongoose.set({ strictQuery: true });
mongoose.connect(
  databaseConnection,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, data) => {
    if (data) {
      console.log(color.bgBlue("Successfully connection to Mongodb Database"));
      const app = require("./app");
      const server = http.createServer(app);
      const port = process.env.PORT ?? 3010;
      server.listen(
        port,
        console.info(
          color.bgYellow(`Server is listening on port ${port}`),
          color.bgCyan(color.bold(`http://localhost:${port}`))
        )
      );
    } else {
      console.log(color.bgRed("Something went wrong", err.message));
    }
  }
);
