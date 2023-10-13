const express = require("express");
const app = express();
const router = require("./routes");

//MongoDB


//1Kirish code
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//2 Session code

//3 Views code
app.set("views", "views");
app.set("view engine", "ejs");

//Routing code
app.use("/", router);

module.exports = app;
