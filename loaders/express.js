const express = require('express');
let path = require('path');
let passport = require('passport');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
//ROUTES
const homeRouter = require("../routes/home.js");
const adminRouter = require("../routes/admin.js");
const ownerRouter = require("../routes/owner.js");
const userRouter = require("../routes/user.js");
const authRouter = require('../routes/auth');
//LIB
const reqAuth = require('../lib/middleware/reqAuth.js');
const userInViews = require('../lib/middleware/userInViews.js');
const checkRole = require('../lib/middleware/checkRole.js');

// Get user roles
const User = require('../schemes/user.js');
require('../passport');

module.exports = async ({ app, connection }) => {
    app.use(passport.initialize());
    app.use(bodyParser());
    app.use(cookieParser());
    
    // View engine setup
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'pug');
    
    if (app.get('env') === 'production') {
        // Use secure cookies in production (requires SSL/TLS)
        //config.session.cookie.secure = true;
      
        // Uncomment the line below if your application is behind a proxy (like on Heroku)
        // or if you're encountering the error message:
        // "Unable to verify authorization request state"
        app.set('trust proxy', 1);
    }

    app.use('/public', express.static(path.join(__dirname, '../public')));
    //app.use('/public', express.static('../public'));

    //attach connection object to req
    app.use((req, res, next) => {
        req.connection = connection;
        next();
    });

    // Add authorize header from jwt cookie, passport authenticate
    app.use(reqAuth());

    app.use(userInViews());

    app.use('/', authRouter);
    app.use('/', homeRouter);
    app.use('/user', checkRole(User.Roles.basic), userRouter); //min role - basic (1)
    app.use('/admin', checkRole(User.Roles.admin), adminRouter); //min role - admin (2)
    app.use('/owner', checkRole(User.Roles.owner), ownerRouter); //min role - owner (3)
     
    app.use(function (req, res, next) {
        let error = { message: "Not Found", status: 404 };
        next(error);
        //res.status(404).send()
    });
    
    // Error handlers
    console.log(app.get('env'));
    // Development error handler
    // Will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
          res.status(err.status || 500);
          res.render('error', {
            message: err.message,
            error: err
          });
        });
    }
    
    // Production error handler
    // No stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: {}
        });
    });

    // ...More middlewares
  
    // Return the express app
    return app;
}