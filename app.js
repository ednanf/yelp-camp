const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const Campground = require("./models/campground");

const app = express();
const URI =
  "mongodb://127.0.0.1:27017/yelp-camp?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.15";

// Mongoose connection
mongoose.connect(URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("********** Connected to Local MongoDB");
});

// EJS configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/make-campgrounds", async (req, res) => {
  const camp = new Campground({ title: "my backyard" });
  await camp.save();
  res.send(camp);
});

// Server start
app.listen(3000, () => {
  console.log("********** Server started on port 3000");
});
