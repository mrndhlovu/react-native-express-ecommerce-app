const GoogleStrategy = require("passport-google-oauth20").Strategy;
const SpotifyStrategy = require("passport-spotify").Strategy;
const User = require("../models/User");

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_SECRET_ID,
} = require("../utils/config");

const passportInit = (passport) => {
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) =>
    User.findById(id).then((user) => done(null, user))
  );

  const getUser = (profile, done) => {
    const { id, displayName, emails, provider } = profile;
    User.findOne({ email: emails[0].value }).then((currentUser) => {
      if (currentUser) return done(null, currentUser);

      new User({
        fname: displayName,
        email: emails[0].value,
        socialAuth: { provider, id },
      })
        .save()
        .then((user) => done(null, user));
    });
  };

  passport.use(
    new GoogleStrategy(
      {
        callbackURL: "/auth/google/redirect",
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
      },
      (accessToken, refreshToken, profile, done) => getUser(profile, done)
    )
  );

  passport.use(
    new SpotifyStrategy(
      {
        callbackURL: "/auth/spotify/redirect",
        clientID: SPOTIFY_CLIENT_ID,
        clientSecret: SPOTIFY_SECRET_ID,
      },
      (accessToken, refreshToken, expires_in, profile, done) =>
        getUser(profile, done)
    )
  );
};

module.exports = passportInit;
