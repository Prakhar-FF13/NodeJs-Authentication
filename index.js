const express = require("express"),
  fs = require("fs"),
  jwt = require("jsonwebtoken"),
  PRIV_KEY_ACCESS = fs.readFileSync(__dirname + "/access_token_rsa_priv.pem"),
  PUB_KEY_ACCESS = fs.readFileSync(__dirname + "/access_token_rsa_pub.pem"),
  PRIV_KEY_REFRESH = fs.readFileSync(__dirname + "/refresh_token_rsa_priv.pem"),
  PUB_KEY_REFRESH = fs.readFileSync(__dirname + "/refresh_token_rsa_pub.pem"),
  { User } = require("./config/postgres");

let refreshTokens = {}; // stores refresh tokens for users.

const app = express();

app.use(express.static("src"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Nothing here - goto /login or /register");
});

app.post("/login", (req, res) => {
  const userDetails = req.body;

  if (!userDetails)
    return res.status(404).json({
      status: "failure",
      message: "Invalid request - no request body",
    });

  User.findOne({ where: { username: userDetails.username } })
    .then((user) => {
      if (!user)
        return res
          .status(404)
          .json({ status: "failure", message: "User does not exist" });

      // create access and refrsh tokens
      const access_token = jwt.sign(user.toJSON(), PRIV_KEY_ACCESS, {
          expiresIn: "10m",
          algorithm: "RS256",
        }),
        refresh_token = jwt.sign(user.toJSON(), PRIV_KEY_REFRESH, {
          expiresIn: "1d",
          algorithm: "RS256",
        });

      // store refresh tokens in valid list.
      refreshTokens[refresh_token] = user.username;

      return res.status(201).json({
        access_token,
        refresh_token,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(403).json({
        status: "failure",
        message: "Somethign went wrong with the server.",
      });
    });
});

app.post("/getNewToken", (req, res) => {
  // user sends the refresh token.
  const refreshToken = req.body.token;
  // refresh token not sent or invalid refresh token.
  if (!refreshToken || !refreshTokens[refreshToken])
    return res.status(403).json({ message: "Failure" });

  // verify refresh otken
  jwt.verify(
    refreshToken,
    PUB_KEY_REFRESH,
    { algorithms: "RS256" },
    (err, user) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ message: "Failure" });
      }
      // delete previous expires property.
      delete user["exp"]; // needed so we can set new one.

      // refrsh token valid.
      // create new access_token.
      const access_token = jwt.sign(user, PRIV_KEY_ACCESS, {
        expiresIn: "10m",
        algorithm: "RS256",
      });

      return res.status(200).json({ access_token });
    }
  );
});

app.post("/register", (req, res) => {
  res.send("Register");
});

const authMiddleWare = (req, res, next) => {
  // token is set in authorization header without bearer keyword.
  const token = req.headers["authorization"],
    parts = token.split(".");

  // jwt has 3 parts seperated by a .
  if (parts.length !== 3)
    return res.status(403).json({
      status: "failure",
      message: "Cannot authenticate users.",
    });

  // jwt was signed using private key now it will be verified by public key.
  jwt.verify(token, PUB_KEY_ACCESS, { algorithms: "RS256" }, (err, user) => {
    if (err) {
      // error when verifying = not authenicated.
      console.log(err);
      return res.status(403).json({
        status: "failure",
        message: "Not authenticated",
      });
    }

    // set the user object.
    req.user = user;
    next();
  });
};

app.get("/profile", authMiddleWare, (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Only authenticated users can see this.",
  });
});

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
