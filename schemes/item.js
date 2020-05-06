/* {"_id":{"$oid":"5e8f5fc21c9d4400001a5381"},
    "item_name":"Water 1L",
    "item_description":"A bottle of water, 1L.",
    "item_price":0.89,
    "item_category":"food",
    "item_price_history":[
        {
            "date":{"$date":"2020-04-06T21:00:00Z"},
            "price":0.89},
        {
            "date":{"$date":"2020-02-08T21:00:00Z"},
            "price":0.85
        }],
    "item_img":"https://cdn.shopify.com/s/files/1/1742/7295/products/Water_Bottle_-_No_Brand_1024x1024.jpg"}
*/

const mongoose = require('mongoose');

//const Categories = Object.freeze({"food":1, "alcohol":2, "other": 3});

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
        required: 'Item price is required',
        min: 0.01
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
        required: "Item image is required"
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