const express = require("express");
const passport = require('passport');
const userController = require("../controllers/userController.js");
let userInViews = require('../lib/middleware/userInViews');
//let secured = require('../lib/middleware/secured.js');
const userRouter = express.Router();

userRouter.get('/', userController.index);
 
module.exports = userRouter;