let express = require('express');
let router = express.Router();
let dotenv = require('dotenv');
const jwt = require('jsonwebtoken'); // аутентификация по JWT
const passport = require('passport');

const db = require('../db.js');
const config = require('../config.json');

//dotenv.config();

router.post('/login', async(req, res, next) => {
  try {
    db.Connect();
    await passport.authenticate('local', { failureRedirect: '../', session: false }, function (err, user) {
      if (user == false) {
        req.user = "Login failed";
      } else {
        //--payload - информация которую мы храним в токене и можем из него получать
        const payload = {
          id: user.id,
          displayName: user.displayName,
          email: user.email
        };
        req.login(user, {session: false}, (err) => {
          if (err) {
              res.send(err);
          }
        });

        const token = jwt.sign(payload, config.jwtsecret); //здесь создается JWT
        res.json({user, token})
      }
      db.Disconnect();
    })(req, res);    
  }
  catch (err) {
    console.error(err);
    req.status = 400;
    req.body = err;
  }
});

router.post('/register', async(req, res, next) => {
  try {
    db.Connect();
    await db.CreateUser(req.body, (doc) => {
      req.user = doc;
      res.send(req.user);
      db.Disconnect();
    });
  }
  catch (err) {
    console.error(err);
    req.status = 400;
    req.body = err;
  }
});

module.exports = router;
