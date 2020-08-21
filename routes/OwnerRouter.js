const express = require("express");
const ownerController = require("../controllers/ownerController.js");

const ownerRouter = express.Router();

ownerRouter.post("/addUser", ownerController.addUser);
ownerRouter.post("/updateUser", ownerController.updateUser);
ownerRouter.post("/deleteUser", ownerController.deleteUser);
ownerRouter.post("/getUsers", ownerController.getUsers);

module.exports = ownerRouter;