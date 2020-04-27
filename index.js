const express = require('express');
const fs = require('fs');
let path = require('path');
//let http = require('http');
let https = require('https');
let passport = require('passport');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

const jwt = require('jsonwebtoken'); // аутентификация по JWT для hhtp
const socketioJwt = require('socketio-jwt'); // аутентификация по JWT для socket.io
const socketIO = require('socket.io');

const config = require('./config.json');

let userInViews = require('./lib/middleware/userInViews');
let secured = require('./lib/middleware/secured');
const db = require('./db.js');

//db.CreateUser('John', 'JohnGreatLul@mail.com', 'test123');

require('./passport');

//----------

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

app.use(passport.initialize());
app.use(bodyParser());
app.use(cookieParser());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



if (app.get('env') === 'production') {
    // Use secure cookies in production (requires SSL/TLS)
    config.session.cookie.secure = true;
  
    // Uncomment the line below if your application is behind a proxy (like on Heroku)
    // or if you're encountering the error message:
    // "Unable to verify authorization request state"
    // app.set('trust proxy', 1);
}

//REDIRECT FROM HTTP
/* app.use((req, res, next) => {
    if(!req.secure) {
        res.redirect(`https://${req.host}:${PORT_HTTPS}${req.baseUrl}${req.url}`);
    } else {
        next();
    }
}); */

app.use('/public', express.static('public'));

app.use('/', function (req, res, next) {
  //if user have jwt cookie or auth header
  if(req.cookies['jwt'] || req.headers["Authorization"] || req.headers["authorization"]){
    //set auth header if there is no such
    if(!req.headers["Authorization"] && !req.headers["authorization"]){ 
      req.headers["authorization"] = "Bearer " + req.cookies['jwt'];
    }
    
    db.Connect();
    //try to auth user
    passport.authenticate('jwt', {session: false}, (err, user) => {
      db.Disconnect();
      if (err) {
        console.log(err);
        return next(err);
      }
      if(!user){
        res.clearCookie('jwt');
        return res.redirect('/login');
      }
      req.logIn(user, function(err) { //serialize user into req.session, create req.user
        if (err) { return next(err); }
        return next();
      });      
    })(req, res, next);

  } else {
    console.log('no header');
    return next();
  }
});

/* app.use('/', function (req, res, next) {
  //if user have jwt cookie or auth header
  if(req.cookies['jwt'] || req.headers["Authorization"] || req.headers["authorization"]){
    //set auth header if there is no such
    if(!req.headers["Authorization"] && !req.headers["authorization"]){ 
      req.headers["authorization"] = "Bearer " + req.cookies['jwt'];
    }
  }
  next();
}); */

app.use(userInViews());

app.use('/', authRouter);
app.use('/', homeRouter);
app.use('/user', secured(), userRouter);

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