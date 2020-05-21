const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    test_name: {
        type: String,
        required: 'Name is required',
        minlength: 3,
        maxlength: 30
    },
    test_description: {
        type: String,
        maxlength: 500
    },
    test_rating:{
        type: Number,
        min: 1,
        max: 5
    }
}, { collection: 'test' });

module.exports = mongoose.model('test', testSchema);