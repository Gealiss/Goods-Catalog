const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; //локальная стратегия авторизации
const JwtStrategy = require('passport-jwt').Strategy; // авторизация через JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // авторизация через JWT

const User = require('./schemes/user.js');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
  },
  function (email, password, done) {
    User.findOne({email}, (err, user) => {
      
      if (err) {
        return done(err);
      }      
      if (!user || !user.checkPassword(password)) {
        return done(null, false, {message: 'User does not exist, or password is incorrect.'});
      }
      return done(null, user);
    });
  }
));

// Ждем JWT в Header

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};
  
passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
  User.findById(payload.id, (err, user) => {

    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
}));