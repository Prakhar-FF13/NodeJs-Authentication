const fs = require("fs"),
  path = require("path"),
  { User } = require("./postgres"),
  pathToKey = path.join(__dirname, "..", "id_rsa_pub.pem"),
  PUB_KEY = fs.readFileSync(pathToKey, "utf-8"),
  { ExtractJwt, Strategy } = require("passport-jwt");

// options that can be passed to passport jwt.
// Commented out ones are not used but can be used.
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY || "secret phrase",
  algorithms: ["RS256"],
  //   issuer: "Enter issuer",
  //   audience: "Enter audience",
  //   ignoreExpiration: false,
  //   passReqToCallback: false,
  //   jsonWebTokenOptions: {
  //     complete: false,
  //     clockTolerance: "",
  //     maxAge: "2d", // 2days,
  //     clockTimestamp: "100",
  //     nonce: "String here for OpenID",
  //   },
};

const strategy = new Strategy(options, (payload, done) => {
  // JWT already verified now find user and return it.
  User.findOne({
    username: payload.sub,
  })
    .then((user) => {
      if (user) return done(null, user);
      return done(null, false);
    })
    .catch((err) => done(err, null));
});

module.exports = (passport) => {
  passport.use(strategy);
};
