const mongoose = require('mongoose'); // стандартная прослойка для работы с MongoDB
const config = require('./config.json');

//Schemes
const User = require('./schemes/user.js');
const ItemFood = require('./schemes/item_food.js');

mongoose.Promise = Promise; // Просим Mongoose использовать стандартные Промисы
mongoose.set('debug', true);  // Просим Mongoose писать все запросы к базе в консоль. Удобно для отладки кода

mongoose.connect(config.mongoose.connString, config.mongoose.opts);
let conn = mongoose.connection;

conn.on('connected', function(){
    console.log("Mongoose default connection is open" , conn);
});

conn.on('disconnected', function(){
    console.log("Mongoose default connection is closed");
});

conn.on('error', function(err){
    console.log(error("Mongoose default connection has occured "+err+" error"));
});

module.exports.Connect = async function(){
    try {
        await mongoose.connect(config.mongoose.connString, config.mongoose.opts);
        if(mongoose.connection._readyState == 1)
            console.log("CONNECTED");
    } catch (error) {
        console.log(error);
        return;
    }
};

module.exports.Disconnect = async function(){
    try {
        await mongoose.disconnect();
        if(mongoose.connection._readyState == 0)
            console.log("DISCONNECTED");
    } catch (error) {
        console.log(error);
        return;
    }
};

module.exports.CreateUser = function(req, cb){
    if(mongoose.connection.readyState != 1){
        return cb("No connection", false);
    }
    User.create(req, function(err, doc){            
        if(err){
            console.log(err);
            return cb(err, false);
        } 
        _doc = doc;
        console.log("Сохранен объект user", doc);
        return cb(null, doc);
    });    
};

module.exports.CreateItemFood = function(req, cb){
    if(mongoose.connection.readyState != 1){
        return cb("No connection", false);
    }
    ItemFood.create(req, function(err, item){            
        if(err){
            console.log(err);
            return cb(err, false);
        }
        if(!item){
            return cb(null, false);
        }
        item.HistoryPrice(Date.now(), item.item_price); //add price to history
        
        return cb(null, item);
    });    
};

module.exports.UpdateItem = function(id, toChange, cb){
    if(mongoose.connection.readyState != 1){
        return cb("No connection", false);
    }

    ItemFood.findByIdAndUpdate(id, toChange, (err, item) => {
        if(err){
            console.log(err);
            return cb(err, false);
        }
        if(!item){
            return cb(null, false);
        }
        if(toChange && toChange.item_price){
            item.HistoryPrice(Date.now(), toChange.item_price); //add price to history
        }       
        
        return cb(null, item);
    });
};

module.exports.DeleteItem = function(id, cb){
    if(mongoose.connection.readyState != 1){
        return cb("No connection", false);
    }

    ItemFood.findByIdAndDelete(id, (err, item) => {
        if(err){
            console.log(err);
            return cb(err, false);
        }
        if(!item){
            return cb(null, false);
        }
        return cb(null, item);
    });
};