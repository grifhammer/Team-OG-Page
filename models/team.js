var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Team = new Schema ({
    id: Number,
    name: String,
    tag: String,
    nationality: String,
    logo: String,
    players: Array,
    leagues: Array

});


module.exports = mongoose.model('Team', Team);