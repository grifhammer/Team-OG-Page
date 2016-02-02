var express = require('express');
var router = express.Router();
var Item = require('../models/item')


/* GET home page. */
router.get('/items', function(req, res, next) {
    Item.find({}, function (err, items){
        res.json(items);
    })
});

module.exports = router;
