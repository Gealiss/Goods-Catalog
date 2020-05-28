const express = require('express');
const fs = require('fs');
let path = require('path');
//let http = require('http');
let https = require('https');
let passport = require('passport');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

const jwt = require('jsonwebtoken'); // аутентификация по JWT для hhtp
//const socketioJwt = require('socketio-jwt'); // аутентификация по JWT для socket.io
const WebSocket = require('ws');
//let dotenv = require('dotenv');
//dotenv.config();

const config = require('./config.json');

let userInViews = require('./lib/middleware/userInViews');
let checkRole = require('./lib/middleware/checkRole');
const User = require('./schemes/user.js');

require('./passport');

//----------

//const PORT_HTTP = 8080 || process.env.PORT;
const PORT_HTTPS = 8443 || process.env.PORT;
const PORT_WS = 80 || process.env.PORT;

//REDIS START
//let redis = require('./redis.js');
//redis.createClient(config.redis);

//ROUTES
const homeRouter = require("./routes/homeRouter.js");
const adminRouter = require("./routes/adminRouter.js");
const ownerRouter = require("./routes/ownerRouter.js");
const userRouter = require("./routes/userRouter.js");
const authRouter = require('./routes/auth');

//HTTPS requirements
var privateKey  = fs.readFileSync("./ssl/private.key", 'utf8');
var certificate = fs.readFileSync("./ssl/mydomain.crt", 'utf8');
var credentials = {key: privateKey, cert: certificate};


//---Express block starts here---
const app = express();
app.set("env", "production");

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

//port available from req.port
app.use((req, res, next) => {
  req.port = PORT_HTTPS;
  next();
});

app.use('/', function (req, res, next) {
  //if user have jwt cookie or auth header
  if(req.cookies['jwt'] || req.headers["Authorization"] || req.headers["authorization"]){
    //set auth header if there is no such
    if(!req.headers["Authorization"] && !req.headers["authorization"]){ 
      req.headers["authorization"] = "Bearer " + req.cookies['jwt'];
    }

    //try to auth user
    passport.authenticate('jwt', {session: false}, (err, user) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      if(!user){
        res.clearCookie('jwt');
        return res.redirect('/');
      }
      req.logIn(user, {session: false}, function(err) { //create req.user
        if (err) { return next(err); }
        return next();
      });      
    })(req, res, next);

  } else {
    console.log('no header');
    return next();
  }
});

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

//DB EVENT EMITTER
const emitter = require('./db').emitter;
let eventName = "priceChange";

//LISTENERS BLOCK
//const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

//WEBSOCKET
const wss = new WebSocket.Server({port: PORT_WS});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  emitter.on(eventName, (data) => {
    let obj = {};
    let price_history = [];
    data.price_history.forEach(elem => {
      price_history.push({date: elem.date, price: elem.price});
    });
    obj.item_id = data.item_id;
    obj.price_history = price_history;
    ws.send(JSON.stringify(obj));
  });
  //ws.send('something');
});

//httpServer.listen(PORT_HTTP, () => {
//    console.log("HTTP server started at: " + `http://localhost:${PORT_HTTP}/`)
//});
httpsServer.listen(PORT_HTTPS, () => {
    console.log("HTTPS server started at: " + `https://localhost:${PORT_HTTPS}/`)
});