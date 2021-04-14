const express = require("express"),
  passport = require("passport"),
  session = require("express-session"),
  pg = require("pg"),
  bodyParser = require("body-parser");
const { User } = require("./config/postgres");

const app = express();

const sessionDBAccess = new pg.Pool({
  user: "test",
  password: "test",
  host: "localhost",
  port: 5432,
  database: "test",
});

app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      pool: sessionDBAccess,
      tableName: "sessions",
    }),
    secret: "Some Secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("src"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Nothing here - goto /login or /register");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
  }),
  (req, res) => {
    res.send("Login");
  }
);

app.post("/register", (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
  })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/profile", (req, res) => {
  res.send("Only logged in viewers can see this.");
});

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
