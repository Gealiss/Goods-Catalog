const express = require('express');
const homeController = require("../controllers/homeController.js");
const homeRouter = express.Router();

homeRouter.get("/", homeController.index);
homeRouter.get("/about", homeController.about);

homeRouter.post("/getItems", homeController.getItems);
homeRouter.post("/getItemByID", homeController.getItemByID);
homeRouter.post("/getItemsCount", homeController.getItemsCount);
 
module.exports = homeRouter;