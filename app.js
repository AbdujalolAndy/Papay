const express = require("express");
const app = express();
const router = require("./router");
const router_BSSR = require("./router_BSSR");

let session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collectioin: "sessions",
});

//1Kirish code
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

module.exports = app;
