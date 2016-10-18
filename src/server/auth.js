const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('./models/user');

passport.use(new FacebookStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: '/auth/login/facebook/return',
  profileFields: [ 'id', 'displayName', 'emails', 'name', 'photos' ]
}, (accessToken, refreshToken, profile, callback) => {
    callback(null, profile);
}
));

passport.serializeUser((user, callback) => callback(null, user));
passport.deserializeUser((obj, callback) => callback(null, obj));

module.exports = passport;