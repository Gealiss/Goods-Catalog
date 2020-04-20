const express = require("express");
const userController = require("../controllers/userController.js");
let secured = require('../lib/middleware/secured.js');
const userRouter = express.Router();

userRouter.get('/', secured(), userController.index);
 
module.exports = userRouter;