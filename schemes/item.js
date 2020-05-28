const mongoose = require('mongoose');

/* var validatePrice = function(item_price) {
    let min = 0.01;
    let max = 1000000;
    if(price >= min && price <= max){
        return true;
    } else {
        return false;
    }    
}; */

const itemSchema = new mongoose.Schema({
    item_name: {
        type: String,
        required: 'Item name is required',
        minlength: 3,
        maxlength: 30
    },
    item_description: {
        type: String,
        maxlength: 500
    },
    item_price: {
        type: Number,
        min: 0.01,
        max: 1000000,
        required: 'Item price is required',
        //validate: [validatePrice, 'Please fill a valid price (0.01 - 1000000)']
    },
    item_price_history: {
        type: [{
                date: Date,
                price: Number
        }]
    },
    item_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    item_image:{
        type: String,
        required: "Item image is required",
        minlength: 5,
        maxlength: 500
    },
    seller:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'seller',
        required: true
    }
}, { collection: 'items' });

itemSchema.methods.HistoryPrice = function(date, price){
    this.item_price_history.push({date: date, price: price});
    this.save();
    return;
};

module.exports = mongoose.model('item', itemSchema);