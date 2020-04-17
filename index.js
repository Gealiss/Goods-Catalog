const express = require('express');
const fs = require('fs');
let http = require('http');
let https = require('https');
let session = require('express-session');
let passport = require('passport');
let cookieParser = require('cookie-parser');

const config = require('./config.json');

let strategy = require('./Auth/Auth0.js').Auth0Strategy;
passport.use(strategy);

//The user id (second argument of the done function) is saved in the session
passport.serializeUser(function (user, done) {
    done(null, user);
});
  
  passport.deserializeUser(function (user, done) {
    done(null, user);
});

let secured = require('./lib/middleware/secured.js');
var userInViews = require('./lib/middleware/userInViews');

const PORT_HTTP = 8080 || process.env.PORT;
const PORT_HTTPS = 8443 || process.env.PORT;

//REDIS START
//let redis = require('./redis.js');
//redis.createClient(config.redis);

//ROUTES
const homeRouter = require("./Routes/HomeRouter.js");
const adminRouter = require("./Routes/AdminRouter.js");
const authRouter = require('./Routes/auth');

//HTTPS requirements
var privateKey  = fs.readFileSync("./ssl/private.key", 'utf8');
var certificate = fs.readFileSync("./ssl/mydomain.crt", 'utf8');
var credentials = {key: privateKey, cert: certificate};

//Express block starts here
const app = express();
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

app.use(userInViews());

app.use('/', authRouter);
app.use("/", homeRouter);

app.use("/admin", (req, res, next) => {
    if(!req.secure){
        req.PORT_HTTPS = PORT_HTTPS;
    }    
    next();
}, adminRouter);

app.get('/user', secured(), function (req, res, next) {
    const { _raw, _json, ...userProfile } = req.user;
    res.send('User' + JSON.stringify(userProfile, null, 2));
});
 
app.use(function (req, res, next) {
    res.status(404).send("Not Found")
});
//Express block ends here


//LISTENERS BLOCK
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(PORT_HTTP, () => {
    console.log("HTTP server started at: " + `http://localhost:${PORT_HTTP}/`)
});
httpsServer.listen(PORT_HTTPS, () => {
    console.log("HTTPS server started at: " + `https://localhost:${PORT_HTTPS}/`)
});