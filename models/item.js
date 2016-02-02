var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Item = new Schema ({
    id: Number,
    itemName: String,
    localizedName: String,
    cost: Number,
    cdnImgURL: String
});


module.exports = mongoose.model('Item', Item);