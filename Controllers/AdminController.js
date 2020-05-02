const db = require('../db.js');

exports.index = function (req, res) {
    res.send("Главная страница admin");
};
exports.about = function (req, res) {
    res.send("О сайте, user = " + req.user);
};

exports.addItem = function (req, res) {
    let itemCategory = req.body.item_category;

    if(req.body.item_price_history){ //prevent a price history add
        return res.send("Item price history cannot be added, it will be add automatically");
    }

    switch (itemCategory) {
        case "food":
            db.CreateItemFood(req.body, (err, item) => {
                if(err){
                    return res.send(err);
                }
                if(!item){
                    return res.send("Some error");
                }
                res.send(item);
            });
            break;
    
        default:
            break;
    }
};

exports.updateItem = function (req, res) {
    let id = req.body._id;
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
    let id = req.body._id;

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