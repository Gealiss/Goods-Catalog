const express = require("express");
const adminController = require("../Controllers/AdminController.js");
let passport = require('passport');
var util = require('util');
var url = require('url');
var querystring = require('querystring');
const adminRouter = express.Router();


adminRouter.use((req, res, next) => { //Check if https
    if(!req.secure) {
        res.redirect(`https://${req.host}:${req.PORT_HTTPS}${req.baseUrl}${req.url}`);
    } else {
        next();
    }    
});

adminRouter.get('/login', passport.authenticate('auth0', {
    scope: 'openid email profile'
}), function (req, res) {
    res.redirect('/');
});

adminRouter.get('/auth', function (req, res, next) {
    passport.authenticate('auth0', function (err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login'); }
      req.logIn(user, function (err) {
        if (err) { return next(err); }
        const returnTo = req.session.returnTo;
        delete req.session.returnTo;
        res.redirect(returnTo || '/');
      });
    })(req, res, next);
  }
);

// Perform session logout and redirect to homepage
adminRouter.get('/logout', (req, res) => {
  req.logout();

  var returnTo = req.protocol + '://' + req.hostname;
  var port = req.connection.localPort;
  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += ':' + port;
  }
  var logoutURL = new url.URL(
    util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN)
  );
  var searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo
  });
  logoutURL.search = searchString;

  res.redirect(logoutURL);
});

  
adminRouter.get("/about", adminController.about);
adminRouter.get("/", adminController.index);
 
module.exports = adminRouter;