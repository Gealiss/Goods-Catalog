const mongoose = require('mongoose'); // стандартная прослойка для работы с MongoDB
const config = require('./config.json');

//Schemes
const User = require('./schemes/user.js');
const Item = require('./schemes/item.js');
const Seller = require('./schemes/seller.js');
const Category = require('./schemes/category.js');

const Test = require('./schemes/test.js'); //JUST FOR TESTS

mongoose.Promise = Promise; // Просим Mongoose использовать стандартные Промисы
mongoose.set('debug', true);  // Просим Mongoose писать все запросы к базе в консоль. Удобно для отладки кода

mongoose.connect(config.mongoose.connString, config.mongoose.opts);
let conn = mongoose.connection;

conn.on('connected', function () {
    console.log("Mongoose default connection is open", conn);

    //TEST BLOCK
/*     Test.create({test_name: "test5", test_rating: 1.1}, function (err, t) {
        if (err) {
            return console.log(err);
        }
        if (!t) {
            return;
        }
        console.log(t);
    }); */
});

conn.on('disconnected', function () {
    console.log("Mongoose default connection is closed");
});

conn.on('error', function (err) {
    console.log(error("Mongoose default connection has occured " + err + " error"));
});

module.exports.Connect = async function () {
    try {
        await mongoose.connect(config.mongoose.connString, config.mongoose.opts);
        if (mongoose.connection._readyState == 1)
            console.log("CONNECTED");
    } catch (error) {
        console.log(error);
        return;
    }
};

module.exports.Disconnect = async function () {
    try {
        await mongoose.disconnect();
        if (mongoose.connection._readyState == 0)
            console.log("DISCONNECTED");
    } catch (error) {
        console.log(error);
        return;
    }
};

//USER
module.exports.CreateUser = function (req, cb) {
    if (mongoose.connection.readyState != 1) {
        return cb("No connection", false);
    }
    User.create(req, function (err, doc) {
        if (err) {
            console.log(err);
            return cb(err, false);
        }
        _doc = doc;
        console.log("Сохранен объект user", doc);
        return cb(null, doc);
    });
};

//SELLER
module.exports.CreateSeller = function (req, cb) {
    if (mongoose.connection.readyState != 1) {
        return cb("No connection", false);
    }
    Seller.create(req, function (err, seller) {
        if (err) {
            console.log(err);
            return cb(err, false);
        }
        if (!seller) {
            return cb(null, false);
        }
        return cb(null, seller);
    });
};

module.exports.GetSellers = function (filter, cb) { //filter: { seller_name: name }
    if (mongoose.connection.readyState != 1) {
        return cb("No connection", false);
    }
    if(!filter){
        filter = {};
    }

    Seller.find(filter, (err, sellers) => {
        if (err) {
            console.log(err);
            return cb(err, false);
        }
        if (!sellers) {
            return cb(null, false);
        }
        return cb(null, sellers);
    });
};

//CATEGORY
module.exports.CreateCategory = function (req, cb) {
    if (mongoose.connection.readyState != 1) {
        return cb("No connection", false);
    }
    Category.create(req, function (err, category) {
        if (err) {
            console.log(err);
            return cb(err, false);
        }
        if (!category) {
            return cb(null, false);
        }
        return cb(null, category);
    });
};

module.exports.GetCategories = function (filter, cb) { //filter: { category_name: name }
    if (mongoose.connection.readyState != 1) {
        return cb("No connection", false);
    }
    if(!filter){
        filter = {};
    }

    Category.find(filter, (err, categories) => {
        if (err) {
            console.log(err);
            return cb(err, false);
        }
        if (!categories) {
            return cb(null, false);
        }
        return cb(null, categories);
    });
};

//ITEM
module.exports.CreateItem = function (req, cb) {
    if (mongoose.connection.readyState != 1) {
        return cb("No connection", false);
    }
    Item.create(req, function (err, item) {
        if (err) {
            console.log(err);
            return cb(err, false);
        }
        if (!item) {
            return cb(null, false);
        }
        item.HistoryPrice(Date.now(), item.item_price); //add price to history

        return cb(null, item);
    });
};

const Emitter = require("events");

let emitter = new Emitter();
let eventName = "priceChange";

module.exports.emitter = emitter;

module.exports.UpdateItem = function (id, toChange, cb) {
    if (mongoose.connection.readyState != 1) {
        return cb("No connection", false);
    }

    Item.findByIdAndUpdate(id, toChange, (err, item) => {
        if (err) {
            console.log(err);
            return cb(err, false);
        }
        if (!item) {
            return cb(null, false);
        }
        if (toChange && toChange.item_price) {
            item.HistoryPrice(Date.now(), toChange.item_price); //add price to history
            emitter.emit(eventName, {item_id: item._id, price_history: item.item_price_history}); //Emit an event for ws
        }

        return cb(null, item);
    });
};

module.exports.DeleteItem = function (id, cb) {
    if (mongoose.connection.readyState != 1) {
        return cb("No connection", false);
    }

    Item.findByIdAndDelete(id, (err, item) => {
        if (err) {
            console.log(err);
            return cb(err, false);
        }
        if (!item) {
            return cb(null, false);
        }
        return cb(null, item);
    });
};

module.exports.GetItemByID = function (id, cb) {
    if (mongoose.connection.readyState != 1) {
        return cb("No connection", false);
    }
    if(!id){
        return cb(null, false);
    }

    Item.findById(id)
    .populate({path: 'item_category'})
    .populate({path: 'seller'})
    .exec((err, item) => {
        if (err) {
            console.log(err);
            return cb(err, false);
        }
        if (!item) {
            return cb(null, false);
        }
        return cb(null, item);
    });
};

module.exports.GetItems = function (skip, limit, filter, cb) {
    if (mongoose.connection.readyState != 1) {
        return cb("No connection", false);
    }

    Item.find(filter.item)
    .populate({
        path:'item_category',
        match: filter.category //{ category_name: { $in: ['Food', ...]}
    })
    .populate({
        path:'seller',
        match: filter.seller //{ seller_name: { $in: ['Altopt', ...]}
    })
    .sort(filter.item_sort)
    .exec((err, items) => {
        if (err) {
            console.log(err);
            return cb(err, false);
        }
        if (!items) {
            return cb(null, false);
        }
        items = items.filter((item) => {
            return item.seller; //return items where item.seller != null (only populated)
        })
        items = items.filter((item) => {
            return item.item_category; //return items where item.seller != null (only populated)
        })

        let selected_items = items.slice(skip, limit); //check indexes

        return cb(null, selected_items, items.length); //RETURNS ONLY NEEDED RANGE
    });
};

module.exports.CountItems = function (filter, cb) {
    if (mongoose.connection.readyState != 1) {
        return cb("No connection", false);
    }

    Item.find(filter.item)
    .populate({
        path:'item_category',
        match: filter.category //{ category_name: { $in: ['Food', ...]}
    })
    .populate({
        path:'seller',
        match: filter.seller //{ seller_name: { $in: ['Altopt', ...]}
    })
    .exec((err, items) => {
        if (err) {
            console.log(err);
            return cb(err, false);
        }
        if (!items) {
            return cb(null, false);
        }
        items = items.filter((item) => {
            return item.seller; //return items where item.seller != null (only populated)
        })
        items = items.filter((item) => {
            return item.item_category; //return items where item.seller != null (only populated)
        })
        return cb(null, items.length);
    });
};