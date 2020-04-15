const express = require('express');
const fs = require('fs');
let http = require('http');
let https = require('https');
const config = require('./config.json');
const strategy = require('./Auth/Auth0.js').Auth0Strategy;
let redis = require('./redis.js');
let session = require('express-session');
let passport = require('passport');

const PORT_HTTP = 8080 || process.env.PORT;
const PORT_HTTPS = 8443 || process.env.PORT;

//REDIS START
//redis.createClient(config.redis);

//ROUTES
const homeRouter = require("./Routes/HomeRouter.js");
const adminRouter = require("./Routes/AdminRouter.js");

//HTTPS requirements
var privateKey  = fs.readFileSync("./ssl/private.key", 'utf8');
var certificate = fs.readFileSync("./ssl/mydomain.crt", 'utf8');
var credentials = {key: privateKey, cert: certificate};

//Express block starts here
const app = express();

if (app.get('env') === 'production') {
    // Use secure cookies in production (requires SSL/TLS)
    config.session.cookie.secure = true;
  
    // Uncomment the line below if your application is behind a proxy (like on Heroku)
    // or if you're encountering the error message:
    // "Unable to verify authorization request state"
    // app.set('trust proxy', 1);
}

app.use(session(config.session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});
  
  passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.use("/", homeRouter);

app.use("/admin", (req, res, next) => {
    if(!req.secure){
        req.PORT_HTTPS = PORT_HTTPS;
    }    
    next();
}, adminRouter);
 
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