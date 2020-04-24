const db = require('../db.js');
const config = require('../config.json');

const jwt = require('jsonwebtoken'); // аутентификация по JWT
const passport = require('passport');

exports.index = function (req, res) {
    const { _raw, _json, ...userProfile } = req.user;
    res.render('user', {
      userProfile: JSON.stringify(userProfile, null, 2),
      title: 'Profile page'
    });
};

exports.login = async(req, res, next) => {
  try {
    db.Connect();
    await passport.authenticate('local', { failureRedirect: '../' }, function (err, user) {
      if (user == false) {
        req.user = "Login failed";
      } else {
        //--payload - информация которую мы храним в токене и можем из него получать
        const payload = {
          id: user.id,
          displayName: user.displayName,
          email: user.email
        };
        const token = jwt.sign(payload, config.jwtsecret); //здесь создается JWT
        console.log(token);
        res.write({user: user.displayName, token: 'JWT ' + token});
      }
      db.Disconnect();
    });
    res.redirect('../');
  }
  catch (err) {
    console.error(err);
    req.status = 400;
    req.body = err;
  }
};

exports.register = async(req, res, next) => {
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
};