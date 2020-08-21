const mongoose = require('mongoose');
const options = require('../config/mongoose.json');

mongoose.Promise = Promise; // Mongoose uses promises
mongoose.set('debug', true);  // Mongoose logs for debugging

module.exports = async () => {
    const connection = await mongoose.connect(process.env.DATABASE_URL, options);
    return connection.connection.db;
}