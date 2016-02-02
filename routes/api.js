var express = require('express');
var router = express.Router();
var Item = require('../models/item')
var Hero = require('../models/hero')


/* GET home page. */
router.get('/items', function(req, res, next) {
    Item.find({}, function (err, items){
        res.json(items);
    })
});

router.get('/heroes', function(req, res, next) {
    Hero.find({}, function (err, heroes){
        res.json(heroes);
    })
});

module.exports = router;
