const express = require('express');
const userController = require("../controllers/userController.js");

const userRouter = express.Router();

userRouter.get('/', userController.index);
 
module.exports = userRouter;