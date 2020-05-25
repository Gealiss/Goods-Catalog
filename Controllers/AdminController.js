const db = require('../db.js');

exports.index = function (req, res) {
    res.send("Главная страница admin");
};
exports.about = function (req, res) {
    res.send("О сайте, user = " + req.user);
};

exports.addSeller = function (req, res) {
    db.CreateSeller(req.body, (err, seller) => {
        if(err){
            return res.send(err);
        }
        if(!seller){
            return res.send("Some error");
        }
        res.send(seller);
    });
};

exports.addCategory = function (req, res) {
    db.CreateCategory(req.body, (err, category) => {
        if(err){
            return res.send(err);
        }
        if(!category){
            return res.send("Some error");
        }
        res.send(category);
    });
};

exports.addItem = function (req, res) {
    if(req.body.item_price_history){ //prevent a price history add
        return res.send("Item price history cannot be added, it will be add automatically");
    }

    db.CreateItem(req.body, (err, item) => {
        if(err){
            return res.json({error: err, item: item});
        }
        if(!item){
            return res.json({error: err, item: item});
        }
        res.send(item);
    });
};

exports.updateItem = function (req, res) {  
    let id = req.body.item_id;
    let toChange = req.body.toChange;

    if(!id && !toChange){
        return res.send("Not correct data to update item");
    }

    if(toChange.item_price_history){ //prevent a price history change
        return res.send("It's not allowed to update item price history from this form");
    }

    db.UpdateItem(id, toChange, (err, item) => {
        if(err){
            return res.send(err);
        }
        if(!item){
            return res.send("Some error");
        }
        res.send(item);
    });
};

exports.deleteItem = function (req, res) {
    let id = req.body.item_id;

    if(!id){
        return res.send("Request did not contain item id");
    }

    db.DeleteItem(id, (err, item) => {
        if(err){
            return res.send(err);
        }
        if(!item){
            return res.send("Some error");
        }
        res.send(item);
    });
};