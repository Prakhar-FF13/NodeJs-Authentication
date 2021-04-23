const express = require("express"),
  { User } = require("./config/postgres"),
  cors = require("cors"),
  passport = require("passport"),
  utils = require("./lib/utils");

const app = express();

require("./config/passport")(passport);
app.use(passport.initialize());

app.use(express.static("src"));
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Nothing here - goto /login or /register");
});

app.post("/login", (req, res) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ success: false, msg: "could not find user" });
      }

      // Function defined at bottom of app.js
      const isValid = utils.validPassword(
        req.body.password,
        user.hash,
        user.salt
      );

      if (isValid) {
        const tokenObject = utils.issueJWT(user);

        res.status(200).json({
          success: true,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
        });
      } else {
        res
          .status(401)
          .json({ success: false, msg: "you entered the wrong password" });
      }
    })
    .catch((err) => {
      res.status(400).json({ failure: "Something went wrong", err });
    });
});

app.post("/register", (req, res) => {
  const saltHash = utils.genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = {
    username: req.body.username,
    hash: hash,
    salt: salt,
  };

  try {
    User.create(newUser).then((user) => res.json(user));
  } catch (err) {
    res.json({ success: false, msg: err });
  }
});

app.get(
  "/profile",
  // do this for every route that needs protection coz jwt are stateless unlike sessions.
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send("Only authenticated users can see this");
  }
);

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
