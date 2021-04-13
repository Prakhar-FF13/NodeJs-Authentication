const express = require("express"),
  { User } = require("./config/postgres");

const app = express();

app.use(express.static("src"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Nothing here - goto /login or /register");
});

app.post("/login", (req, res) => {
  res.send("Login");
});

app.post("/register", (req, res) => {
  res.send("Register");
});

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
