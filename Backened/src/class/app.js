const express = require("express");
const app = express();
const session = require("express-session");

let sessionObject = {
  secret: "hellohammad",
  resave: false,
  saveUninitialized: true,
  expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
};

app.use(session(sessionObject));

app.get("/new", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  console.log(req.session.name);
  res.send(`hello ${req.session.name}`);
});

app.get("/register", (req, res) => {
  res.send(req.session.name);
});

app.listen(3000, () => {
  console.log("🚀 Server is running on port 3000");
});
