const express = require("express");
const app = express();
const router = require("./router");
const cors = require("cors");
const router_BSSR = require("./router_BSSR");
const cookieParser = require("cookie-parser");
const http = require("http");

let session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: "sessions",
});

//1Kirish code
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

//2 Session code
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 30, //session for 30 minutes
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.locals.member = req.session.member;
  next();
});

//3 Views code
app.set("views", "views");
app.set("view engine", "ejs");

//Routing code
app.use("/resto", router_BSSR);
app.use("/", router);

//Socket.Io
const server = http.createServer(app);
const io = require("socket.io")(server, {
  serveClient: false,
  origins: "*:*",
  transport: ["websocket", "xhr-polling"],
});

let onlineUsers = 0;
io.on("connection", function (socket) {
  onlineUsers++;
  console.log("New user, total:", onlineUsers);
  socket.emit("greetMsg", { text: "Welcome" });
  io.emit("infoMsg", { total: onlineUsers });

  socket.on("disconnect", () => {
    onlineUsers--;
    socket.broadcast.emit("infoMsg", { total: onlineUsers });
    console.log("Client Disconnected total", onlineUsers);
  });

  socket.on("createMsg", (data) => {
    io.emit("newMsg", data);
    console.log("new message", data);
  });
});

module.exports = server;
