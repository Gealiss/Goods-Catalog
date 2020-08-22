//const PORT_HTTPS = 8443 || process.env.PORT;
//const PORT_WS = 80 || process.env.PORT;

//HTTPS requirements
/* var privateKey  = fs.readFileSync("./ssl/private.key", 'utf8');
var certificate = fs.readFileSync("./ssl/mydomain.crt", 'utf8');
var credentials = {key: privateKey, cert: certificate}; */

//REDIRECT FROM HTTP
/* app.use((req, res, next) => {
    if(!req.secure) {
        res.redirect(`https://${req.host}:${PORT_HTTPS}${req.baseUrl}${req.url}`);
    } else {
        next();
    }
}); */

const PORT = process.env.PORT || 8080;
try {
  require('dotenv').config();
} catch (error) {
  console.log(error);
}

const loaders = require('./loaders');
const express = require('express');


async function startServer() {

  const app = express();

  //port number available from req.port
  app.use((req, res, next) => {
    req.port = PORT;
    next();
  });

  app.set("env", "development"); // development or production

  await loaders({ expressApp: app });

  app.listen(PORT, err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Server is ready at port: ' + PORT);
  });
}

startServer();