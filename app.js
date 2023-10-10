const express = require("express");
const app = express();

//1 Kirish code
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//2 MongoDB
const db = require("./server").db();

//3 Views code
app.set("views", "views");
app.set("view engine", "ejs");



module.exports = app;