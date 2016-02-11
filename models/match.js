var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Match = new Schema ({
    id: Number,
    radiant_id: Number,
    radiant_name: String,
    radiant_team: Array,
    dire_id: Number,
    dire_name: String,
    dire_team: Array,
    winner: String

});


module.exports = mongoose.model('Match', Match);