const mongoose = require('mongoose'); // стандартная прослойка для работы с MongoDB
const config = require('./config.json');

//Schemes
const User = require('./schemes/user.js');
const Item = require('./schemes/item.js');
const Seller = require('./schemes/seller.js');
const Category = require('./schemes/category.js');

mongoose.Promise = Promise; // Просим Mongoose использовать стандартные Промисы
mongoose.set('debug', true);  // Просим Mongoose писать все запросы к базе в консоль. Удобно для отладки кода

mongoose.connect(config.mongoose.connString, config.mongoose.opts);
let conn = mongoose.connection;

conn.on('connected', function () {
    console.log("Mongoose default connection is open", conn);
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

module.exports.GetItemsRange = function (from, to, cb) {
    if (mongoose.connection.readyState != 1) {
        return cb("No connection", false);
    }

    Item.find({}, null, { skip: from - 1, limit: to })
    .populate('item_category')
    .exec((err, items) => {
        if (err) {
            console.log(err);
            return cb(err, false);
        }
        if (!items) {
            return cb(null, false);
        }
        return cb(null, items);
    });
};

module.exports.CountItems = function (from, to, cb) {
    if (mongoose.connection.readyState != 1) {
        return cb("No connection", false);
    }

    Item.count({}, function (err, count) {
        if (err) {
            console.log(err);
            return cb(err, false);
        }
        if (!count) {
            return cb(null, false);
        }
        return cb(null, count);
    })
};
