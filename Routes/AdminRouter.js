const express = require("express");
const adminController = require("../controllers/adminController.js");

const adminRouter = express.Router();

adminRouter.get("/about", adminController.about);
adminRouter.get("/", adminController.index);

adminRouter.post("/addSeller", adminController.addSeller);
adminRouter.post("/updateSeller", adminController.updateSeller);
adminRouter.post("/deleteSeller", adminController.deleteSeller);

adminRouter.post("/addItem", adminController.addItem);
adminRouter.post("/updateItem", adminController.updateItem);
adminRouter.post("/deleteItem", adminController.deleteItem);

adminRouter.post("/addCategory", adminController.addCategory);
adminRouter.post("/updateCategory", adminController.updateCategory);
adminRouter.post("/deleteCategory", adminController.deleteCategory);

 
module.exports = adminRouter;