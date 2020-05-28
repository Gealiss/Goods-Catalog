const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: 'Category name is required',
        minlength: 3,
        maxlength: 30
    },
    category_description: {
        type: String,
        maxlength: 500
    }
}, { collection: 'categories' });

module.exports = mongoose.model('category', categorySchema);