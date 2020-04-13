const express = require('express');
const fs = require('fs');
var http = require('http');
var https = require('https');

//HTTPS requirements
var privateKey  = fs.readFileSync("./ssl/private.key", 'utf8');
var certificate = fs.readFileSync("./ssl/mydomain.crt", 'utf8');
var credentials = {key: privateKey, cert: certificate};

const PORT_HTTP = 80 || process.env.PORT;
const PORT_HTTPS = 8443 || process.env.PORT;

const homeRouter = require("./Routes/HomeRouter.js");
const adminRouter = require("./Routes/AdminRouter.js");

const app = express();

//Express block starts here

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

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(PORT_HTTP, () => {
    console.log("HTTP server started at: " + `http://localhost:${PORT_HTTP}/`)
});
httpsServer.listen(PORT_HTTPS, () => {
    console.log("HTTPS server started at: " + `https://localhost:${PORT_HTTPS}/`)
});