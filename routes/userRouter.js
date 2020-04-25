const express = require("express");
const passport = require('passport');
const userController = require("../controllers/userController.js");
let secured = require('../lib/middleware/secured.js');
const userRouter = express.Router();

userRouter.get('/', passport.authenticate('jwt', {session: false}), userController.index);
 
module.exports = userRouter;