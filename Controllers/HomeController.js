const db = require('../db.js');
const pug = require('pug');

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
    res.send("Course project: Goods Catalog. 2020 y.");
};

exports.getItems = function (req, res) {
    let skip = req.body.skip;
    let limit = req.body.limit;
    let filter = {};

    if(req.body.filter){
        filter = req.body.filter;
    }
    if(filter.item && filter.item.item_name){
        filter.item.item_name = new RegExp(`^(${filter.item.item_name}).*`, 'gmi'); //change item_name to regexp
    }
    
    //default range of items to load
    if(skip == undefined){
        skip = 0;
        limit = 12;
    } else if(limit == undefined){
        skip = 0;
        limit = 12;
    }

    db.GetItems(skip, limit, filter, (err, items, total_count) => {
        if(err){
            return res.send(err);
        }
        if(!items){
            return res.send("Some error");
        }
        res.render('items-list', { items_list: items }, (err, html) => {
            if(err){
                return res.send("Some error");
            }
            res.json({list_html: html, total_count: total_count});
        });
    });
};

exports.getItemByID = function (req, res){
    let item_id = req.body.item_id;
    if(!item_id){
        res.send("Id is null");
    }
    db.GetItemByID(item_id, (err, item) => {
        if(err){
            return res.send(err);
        }
        if(!item){
            return res.send("Some error");
        }
        res.json(item);
    });
};

exports.getItemsCount = function (req, res) {
    let filter = {};

    if(req.body.filter){
        filter = req.body.filter;
    }
    if(filter.item && filter.item.item_name){
        filter.item.item_name = new RegExp(`^(${filter.item.item_name}).*`, 'gmi'); //change item_name to regexp
    }

    db.CountItems(filter, (err, count) => {
        if(err){
            return res.send(err);
        }
        if(!count){
            return res.send("Some error");
        }
        res.json({ items_count: count });
    });
};