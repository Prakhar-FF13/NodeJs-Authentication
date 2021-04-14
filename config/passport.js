const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  { User } = require("./postgres");

const verifyCallback = (username, password, done) => {
  User.findOne({
    username: username,
  })
    .then((user) => {
      if (!user) return done(null, false);

      const isValid = user.getDataValue("password") === password;

      if (!isValid) return done(null, false);

      return done(null, user);
    })
    .catch((err) => {
      return done(err);
    });
};

const strategy = new LocalStrategy("local", verifyCallback);

passport.use(strategy);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (user, cb) {
  User.findOne({
    username: user,
  })
    .then(() => cb(null, user))
    .catch((err) => cb(err));
});
