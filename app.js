const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = express();
const User = require("./models/user");
const session = require("express-session");

mongoose.connect("mongodb://localhost:27017/authDemo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "privatekey" }));
const requireLogin = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  } else {
    next();
  }
};
app.get("/", (req, res) => {
  res.send("this is the homepage");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({
    username,
    password
  });
  await user.save();
  req.session.user_id = user._id;
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findAndValidate(username, password);
  if (foundUser) {
    req.session.user_id = foundUser._id; //setting the session user id to the user._id of the mongoDB user document
    res.redirect("/secret");
  } else {
    res.send("incorrect");
  }
});

app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/login");
});

app.get("/secret", requireLogin, (req, res) => {
  res.render("secret");
});
app.get("/secret2", requireLogin, (req, res) => {
  res.send("logged in");
});
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
