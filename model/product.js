var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var product = new Schema({
    text: String,
    price: Number,
    imgUrl: String,
    likes: {type: Number, default:0}
});

module.exports = mongoose.model('Product',product);