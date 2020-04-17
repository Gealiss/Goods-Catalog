const express = require("express");
const adminController = require("../Controllers/AdminController.js");

const adminRouter = express.Router();

adminRouter.use((req, res, next) => { //Check if https
    if(!req.secure) {
        res.redirect(`https://${req.host}:${req.PORT_HTTPS}${req.baseUrl}${req.url}`);
    } else {
        next();
    }    
});

adminRouter.get("/about", adminController.about);
adminRouter.get("/", adminController.index);
 
module.exports = adminRouter;