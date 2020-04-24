const mongoose = require('mongoose'); // стандартная прослойка для работы с MongoDB
const config = require('./config.json');

//Schemes
const User = require('./schemes/user.js');

mongoose.Promise = Promise; // Просим Mongoose использовать стандартные Промисы
mongoose.set('debug', true);  // Просим Mongoose писать все запросы к базе в консоль. Удобно для отладки кода
//mongoose.connect(config.mongoose.connString, config.mongoose.opts);

module.exports.Connect = function(){
    mongoose.connect(config.mongoose.connString, config.mongoose.opts);
};

module.exports.Disconnect = function(){
    mongoose.disconnect();
};

module.exports.CreateUser = function(req, cb){
    User.create(req, function(err, doc){
        if(err) return console.log(err);
        _doc = doc;
        console.log("Сохранен объект user", doc);
        cb(doc);
    });
};