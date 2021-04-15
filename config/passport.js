const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  { User } = require("./postgres");

/*
  This is the function that passport runs when user provides a username and password.
  It logs in the user if password matches.

  A Cookie is set in browser. This cookie identifies a unique session in server.
*/
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

/* 
  It defines what is stored in the sessions table 
  Currently only user id is stored.
*/
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

/*
  On another request by same user, the cookie set is also sent along with this request,
  Cookie helps in identifying the session, through session we get the userId (as the session only stored userId)
  Now passport will call this method to fetch all details on the user
  The details returned by this function is stored in req.user
*/
passport.deserializeUser(function (user, cb) {
  User.findOne({
    username: user,
  })
    .then(() => cb(null, user))
    .catch((err) => cb(err));
});
