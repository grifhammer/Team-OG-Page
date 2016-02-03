var express = require('express');
var router = express.Router();

var DataManager = require('../data-manager')
DataManager = new DataManager;

var Item = require('../models/item')
var Hero = require('../models/hero')
var Members = require('../models/team-members');


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

router.post('/delete', function (req, res, next){
    if(req.body.deleteAuth == true){
        DataManager.resetDatabase();
    }
    res.end();
});


router.post('/players', function (req, res, next){
    var playerArray = req.body.players;
    playerArray.forEach(function(player){
        DataManager.updatePlayer(player, function (err, result){
            if(err){
                console.log(err);
            }
            res.end();
        });
    });
});

router.post('/team', function (req, res, next){
    var team = req.body.team;
    DataManager.updateTeam(team, function (err, result){
        if(err){
            console.log(err)
        }
        res.end();
    });
});

module.exports = router;
