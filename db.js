const mongoose = require('mongoose'); // стандартная прослойка для работы с MongoDB

//Schemes
const User = require('./schemes/user.js');
const Item = require('./schemes/item.js');
const Seller = require('./schemes/seller.js');
const Category = require('./schemes/category.js');

//Emmiter
const Emitter = require("events");
let emitter = new Emitter();
let eventName = "priceChange";

//let connection;

module.exports = () => {
    //connection = mongoConnection;
    let module = {};

    module.Emitter = emitter;
    module.Connect = Connect;
    module.Disconnect = Disconnect;

    //USER
    module.CreateUser = CreateUser;
    module.UpdateUser = UpdateUser;
    module.DeleteUser = DeleteUser;
    module.GetUsers = GetUsers;

    //SELLER
    module.CreateSeller = CreateSeller;
    module.UpdateSeller = UpdateSeller;
    module.DeleteSeller = DeleteSeller;
    module.GetSellers = GetSellers;

    //CATEGORY
    module.CreateCategory = CreateCategory;
    module.UpdateCategory = UpdateCategory;
    module.DeleteCategory = DeleteCategory;
    module.GetCategories = GetCategories;

    //ITEM
    module.CreateItem = CreateItem;
    module.UpdateItem = UpdateItem;
    module.DeleteItem = DeleteItem;
    module.GetItemByID = GetItemByID;
    module.GetItems = GetItems;
    module.CountItems = CountItems;

    return module;
}

async function Connect() {
    try {
        await mongoose.connect(config.mongoose.connString, config.mongoose.opts);
        if (mongoose.connection._readyState == 1)
            console.log("CONNECTED");
    } catch (error) {
        console.log(error);
        return;
    }
};

async function Disconnect() {
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
async function CreateUser(req, cb) {
    User.create(req, function (err, user) {
        if (err) {
            console.log(err);
            return cb(err, false);
        }
        if (!user) {
            return cb(null, false);
        }
        return cb(null, user);
    });
};

async function UpdateUser(id, toChange, cb) {
    User.findByIdAndUpdate(id, toChange, { runValidators: true }, function (err, user) {
        if (err) {
            console.log(err);
            return cb(err, false);
        }
        if (!user) {
            return cb(null, false);
        }
        return cb(null, user);
    });
};

async function DeleteUser(id, cb) {
    User.findByIdAndDelete(id, (err, user) => {
        if (err) {
            console.log(err);
            return cb(err, false);
        }
        if (!user) {
            return cb(null, false);
        }
        return cb(null, user);
    });
};

async function GetUsers(filter, cb) { //filter: { user_email: email }
    if(!filter){
        filter = {};
    }

    User.find(filter, (err, users) => {
        if (err) {
            console.log(err);
            return cb(err, false);
        }
        if (!users) {
            return cb(null, false);
        }
        return cb(null, users);
    });
};

//SELLER
async function CreateSeller(req, cb) {
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

async function UpdateSeller(id, toChange, cb) {
    Seller.findByIdAndUpdate(id, toChange, { runValidators: true }, function (err, seller) {
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

async function DeleteSeller(id, cb) {
    Seller.findByIdAndDelete(id, (err, seller) => {
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

async function GetSellers(filter, cb) { //filter: { seller_name: name }
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
async function CreateCategory(req, cb) {
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

async function UpdateCategory(id, toChange, cb) {
    Category.findByIdAndUpdate(id, toChange, { runValidators: true }, function (err, category) {
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

async function DeleteCategory(id, cb) {
    Category.findByIdAndDelete(id, (err, category) => {
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

async function GetCategories(filter, cb) { //filter: { category_name: name }
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
async function CreateItem(req, cb) {
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

//emition
async function UpdateItem(id, toChange, cb) {
    Item.findByIdAndUpdate(id, toChange, { runValidators: true }, (err, item) => {
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

async function DeleteItem(id, cb) {
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

async function GetItemByID(id, cb) {
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

async function GetItems(skip, limit, filter, cb) {
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

async function CountItems(filter, cb) {
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