const mongodb = require("mongodb");
const http = require("http");

const databaseConnection =
  "mongodb+srv://andy:bav52w6vfTXIq5Cy@cluster0.4ahexgk.mongodb.net/Papays";

mongodb.connect(
  databaseConnection,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) {
      console.log("Something went wrong");
    } else {
      console.log("Successfully connection to Mongodb Database");
      module.exports = client;
      const app = require("./app");
      const server = http.createServer(app);
      const port = process.env.PORT ?? 3010;
      server.listen(port, console.info(`Server is listening on port ${port}`,`http://localhost:${port}`));
      
    }
  }
);
