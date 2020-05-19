const db = require('../db.js');

exports.index = function (req, res) {

    db.GetSellers(null, (err, sellers) =>{
        if(err){
            return res.send(err);
        }
        if(!sellers){
            return res.send("Some error");
        }

        db.GetCategories(null, (err, categories) =>{
            if(err){
                return res.send(err);
            }
            if(!categories){
                return res.send("Some error");
            }
            res.render('index', { title: 'Home', sellers: sellers, categories: categories});
        })
    });
};

exports.about = function (req, res) {
    res.send("О сайте");
};

exports.login = function (req, res) {
    res.render('test'), {title: 'Test login'};
};

exports.getItems = function (req, res) {
    let from = req.body.from;
    let to = req.body.to;
    let filter = {};

    if(req.body.filter){
        filter = req.body.filter;
    }
    if(filter.item && filter.item.item_name){
        filter.item.item_name = new RegExp(`^(${filter.item.item_name}).*`, 'gmi'); //change item_name to regexp
    }
    
    //default range of items to load
    if(!from){      
        from = 1;
        to = 20;
    } else if(!to){
        from = 1;
        to = 20;
    }

    db.GetItems(from, to, filter, (err, items) => {
        if(err){
            return res.send(err);
        }
        if(!items){
            return res.send("Some error");
        }
        res.render('items-list', { items_list: items });
    });
};