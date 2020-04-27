const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; //локальная стратегия авторизации
const JwtStrategy = require('passport-jwt').Strategy; // авторизация через JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // авторизация через JWT

const User = require('./schemes/user.js');
const config = require('./config.json');
const db = require('./db.js');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
  },
  function (email, password, done) {
    db.Connect();
    
    User.findOne({email}, (err, user) => {
      db.Disconnect();
      if (err) {
        return done(err);
      }      
      if (!user || !user.checkPassword(password)) {
        return done(null, false, {message: 'Пользователь не существует, либо пароль неверен.'});
      }
      return done(null, user);
    });
  }
  )
);

// Ждем JWT в Header

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtsecret
};
  
passport.use(new JwtStrategy(jwtOptions, function (payload, done) { //USES NEW INSTANCE CONNECTION
  //console.log("JWT strat payload", payload);
  //db.Connect();

  User.findById(payload.id, (err, user) => {
    //db.Disconnect();
    if (err) {
      return done(err)
    }
    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});