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
          role: user.role,
          email: user.email
        };
        req.login(user, {session: false}, (err) => {
          if (err) {
              res.send(err);
          }
        });

        const token = jwt.sign(payload, config.jwtsecret, {expiresIn: '1h'}); //здесь создается JWT
        res.cookie('jwt', token, {
          secure: true,
          httpOnly: true,
          expires: new Date(Date.now() + 1 * 3600 * 1000)
        });
        //res.setHeader('Authorization', 'Bearer '+ token); 
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

router.get('/logout', (req, res, next) => {
  res.clearCookie('jwt');
  res.redirect('/');
});

module.exports = router;
