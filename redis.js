const redis = require("redis");

//REDIS
module.exports.createClient = (options) => {
    redis.createClient(options);
};