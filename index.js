const express = require("express"),
  passport = require("passport"),
  session = require("express-session"),
  pg = require("pg"),
const { User } = require("./config/postgres");

const app = express();

// connection info for express-session to make calls to db.
const sessionDBAccess = new pg.Pool({
  user: "test",
  password: "test",
  host: "localhost",
  port: 5432,
  database: "test",
});

app.use(
  session({
    // connect-pg-simple is specific for postgres to store sessions in postgres database.
    store: new (require("connect-pg-simple")(session))({
      pool: sessionDBAccess, // connection info.
      tableName: "sessions", // table where we have to store the session. (see postgres file)
    }),
    secret: "Some Secret", // encryting session
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // age after which session expires. 24 hours.
    },
  })
);

app.use(express.static("src"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./config/passport"); // define methods for passport.

app.use(passport.initialize()); // initializes the passport with provided verifyCallback, serialize and deserialize functions.
app.use(passport.session()); // presistent login sessions.

app.get("/", (req, res) => {
  res.send("Nothing here - goto /login or /register");
});

/* 
  Postman app is used to login instead of using a form.
  We can create a form on app.get('/login') and then send form data to this post method too.
*/
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
  })
);

// create a user.
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
  /*
    req.isAuthenticated method checks whether the user property is set or not.
    (user property is set after deserializeUser method returns user)
  */
  if (req.isAuthenticated()) res.send("Only logged in viewers can see this.");
  else res.send("You need to be logged in to be here.");
});

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
