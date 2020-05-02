let express = require('express');
let router = express.Router();
let dotenv = require('dotenv');
const jwt = require('jsonwebtoken'); // аутентификация по JWT
const passport = require('passport');
const moment = require('moment');

const db = require('../db.js');
const config = require('../config.json');

//dotenv.config();

router.post('/login', (req, res, next) => {
  try {    
    passport.authenticate('local', { failureRedirect: '../', session: false }, function (err, user) {
      if (err) {
        return next(err);
      }
      if (user == false) {
        return next();
      } else {
        //--payload - информация которую мы храним в токене и можем из него получать
        const payload = {
          id: user.id,
          role: user.role,
          email: user.email
        };
        req.login(user, {session: false}, (_err) => {
          if (_err) {
              return next(_err);
          }
        });

        const token = jwt.sign(payload, config.jwtsecret, {expiresIn: '1h'}); //здесь создается JWT
        res.cookie('jwt', token, {
          secure: true,
          httpOnly: true,
          expires: moment().add(1, 'h').toDate() //1 hour
          //expires: new Date(Date.now() + 1 * 3600 * 1000) //1 hour
        });

        return res.send(`${req.protocol}://${req.host}:${req.port}/`); //send redirect url - home page
      }
    })(req, res, next);    
  }
  catch (err) {
    console.error(err);
    req.status = 400;
    req.body = err;
    next(err);
  }
});

router.post('/register', (req, res, next) => {
  try {
    db.CreateUser(req.body, (err, doc) => {
      if(err){
        return next(err);
      }
      req.user = doc;
      return res.send(req.user);    
    });
  }
  catch (err) {
    console.error(err);
    req.status = 400;
    req.body = null;
    return next(err);
  }
});

router.get('/logout', (req, res, next) => {
  res.clearCookie('jwt');
  res.redirect('/');
});

module.exports = router;
