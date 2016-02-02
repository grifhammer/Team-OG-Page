var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Hero = new Schema ({
    id: Number,
    heroName: String,
    localizedName: String,
    cdnImgURL: String
});

module.exports = mongoose.model('Hero', Hero);
