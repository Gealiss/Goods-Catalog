const mongoose = require('mongoose'); // стандартная прослойка для работы с MongoDB
const config = require('./config.json');

//Schemes
const User = require('./schemes/user.js');

mongoose.Promise = Promise; // Просим Mongoose использовать стандартные Промисы
mongoose.set('debug', true);  // Просим Mongoose писать все запросы к базе в консоль. Удобно для отладки кода
//mongoose.connect(config.mongoose.connString, config.mongoose.opts);


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
    User.create(req, function(err, doc){            
        if(err){
            console.log(err);
            return cb(err, false);
        } 
        _doc = doc;
        console.log("Сохранен объект user", doc);
        return cb(null, doc);;
    });    
};