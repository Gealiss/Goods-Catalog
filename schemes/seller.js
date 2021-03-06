const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    seller_name: {
        type: String,
        required: 'Seller name is required',
        minlength: 3,
        maxlength: 30
    },
    seller_description: {
        type: String,
        maxlength: 500
    },
    seller_image:{
        type: String,
        minlength: 5,
        maxlength: 500
    }
}, { collection: 'sellers' });

module.exports = mongoose.model('seller', sellerSchema);