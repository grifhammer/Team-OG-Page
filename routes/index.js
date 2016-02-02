var express = require('express');
var router = express.Router();
var Members = require('../models/team-members');
var Match = require('../models/match')
var Item = require('../models/item')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Team OG',
                        active: "home",
                        teamId: req.query.teamId || ""});
});

router.get('/team', function(req, res, next){
    // var team = DataManager.findTeam(teamId);
    Members.find({}, function (err, result){
        res.render('team', {team: "ME", 
                            teamMembers: result,
                            active: "team"
                            });
    });
});

router.get('/matches', function (req, res, next){
    Match.find({}).limit(25).exec( function (err, matches){
        if(err){
            res.render('error', {
                error: err
            });
            return;
        }
        Item.find({}, function (err, items){
            if(err){
                res.render('error', {
                    error: err
                });
                return;
            }
            res.render('matches', {
                active: 'matches',
                matches: matches,
                items: items
            });
        })
    });
})

module.exports = router;
