const express = require("express");
const adminController = require("../controllers/adminController.js");

const adminRouter = express.Router();

adminRouter.get("/about", adminController.about);
adminRouter.get("/", adminController.index);


adminRouter.post("/addItem", adminController.addItem);
adminRouter.post("/updateItem", adminController.updateItem);
adminRouter.post("/deleteItem", adminController.deleteItem);

 
module.exports = adminRouter;