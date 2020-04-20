const express = require('express');
const fs = require('fs');
let path = require('path');
//let http = require('http');
let https = require('https');
let session = require('express-session');
let passport = require('passport');
let cookieParser = require('cookie-parser');

const config = require('./config.json');
let userInViews = require('./lib/middleware/userInViews');

let strategy = require('./auth/auth0.js').Auth0Strategy;
passport.use(strategy);

//The user id (second argument of the done function) is saved in the session
passport.serializeUser(function (user, done) {
    done(null, user);
});
  
  passport.deserializeUser(function (user, done) {
    done(null, user);
});

//const PORT_HTTP = 8080 || process.env.PORT;
const PORT_HTTPS = 8443 || process.env.PORT;

//REDIS START
//let redis = require('./redis.js');
//redis.createClient(config.redis);

//ROUTES
const homeRouter = require("./routes/homeRouter.js");
const adminRouter = require("./routes/adminRouter.js");
const userRouter = require("./routes/userRouter.js");
const authRouter = require('./routes/auth');

//HTTPS requirements
var privateKey  = fs.readFileSync("./ssl/private.key", 'utf8');
var certificate = fs.readFileSync("./ssl/mydomain.crt", 'utf8');
var credentials = {key: privateKey, cert: certificate};

//---Express block starts here---
const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cookieParser());

if (app.get('env') === 'production') {
    // Use secure cookies in production (requires SSL/TLS)
    config.session.cookie.secure = true;
  
    // Uncomment the line below if your application is behind a proxy (like on Heroku)
    // or if you're encountering the error message:
    // "Unable to verify authorization request state"
    // app.set('trust proxy', 1);
}

app.use(session(config.session));
app.use(passport.initialize());
app.use(passport.session());

//REDIRECT IN CASE OF LISTENING TO HTTP
/* app.use((req, res, next) => {
    if(!req.secure) {
        res.redirect(`https://${req.host}:${PORT_HTTPS}${req.baseUrl}${req.url}`);
    } else {
        next();
    }
}); */

app.use(userInViews());

app.use('/', authRouter);
app.use('/', homeRouter);
app.use('/user', userRouter);
//app.get('/admin', adminRouter);
 
app.use(function (req, res, next) {
    res.status(404).send("Not Found")
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


//LISTENERS BLOCK

//const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

//httpServer.listen(PORT_HTTP, () => {
//    console.log("HTTP server started at: " + `http://localhost:${PORT_HTTP}/`)
//});
httpsServer.listen(PORT_HTTPS, () => {
    console.log("HTTPS server started at: " + `https://localhost:${PORT_HTTPS}/`)
});