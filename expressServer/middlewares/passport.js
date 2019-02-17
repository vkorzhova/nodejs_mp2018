const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;

const users = require('../helpers/users.json');

passport.use(
  new LocalStategy({
    usernameField: 'login',
    passwordField: 'password',
    session: false,
  }, (login, password, done) => {
    const user = users.find(user => user.login === login);
    const isPasswordValid = user.password === password;

    if (!user || !isPasswordValid) {
      done(null, false);
    } else {
      done(null, user);
    }
  })
);

passport.use(
  new FacebookStrategy({
    clientID: '1140145109356677',
    clientSecret: 'b14b7f34d338d6f9d296b49f8d76ef9c',
    callbackURL: 'http://localhost:8080/auth/facebook/callback',
  }, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  })
);

passport.use(
  new GoogleStrategy({
    clientID: '946316892963-bj21aamcc216mtpt2tb12cirjcd3eu78.apps.googleusercontent.com',
    clientSecret: '5lf6PsTWpSyZ92FSaFck0Vzb',
    callbackURL: 'http://localhost:8080/auth/google/callback',
  }, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  })
);

// use GitHub strategy instead Twitter strategy, because twitter is still considering my application to create an app :c
passport.use(
  new GitHubStrategy({
    clientID: 'dbca6ff70d7dabdbab8a',
    clientSecret: 'd006a7720287f6d2cc682707578757af63f78746',
    callbackURL: 'http://localhost:8080/auth/github/callback'
  }, (token, tokenSecret, profile, done) => {
    done(null, profile);
  })
);

module.exports = passport;
