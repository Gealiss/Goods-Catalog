const db = require('../db.js');

exports.index = function (req, res) {
    res.render('index', { title: 'Home' });
};

exports.about = function (req, res) {
    res.send("О сайте");
};

exports.login = function (req, res) {
    res.render('test'), {title: 'Test login'};
};

exports.getItemsRange = function (req, res) {
    let from = req.body.from;
    let to = req.body.to;

    if(!from){      //default range of items to load
        from = 1;
    }
    if(!to){
        to = 20;
    }

    db.GetItemsRange(from, to, (err, items) => {
        if(err){
            return res.send(err);
        }
        if(!items){
            return res.send("Some error");
        }
        res.send(items);
    });
};