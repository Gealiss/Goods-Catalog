const express = require('express');
const app = express();
const PORT = 3000 || process.env.PORT;

const homeRouter = require("./Routes/HomeRouter.js");

app.use("/", homeRouter);
 
app.use(function (req, res, next) {
    res.status(404).send("Not Found")
});

app.listen(PORT, () => {
    console.log("Server started at port " + PORT);
});