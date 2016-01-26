var express = require('express');
var router = express.Router();
var Members = require('../models/team-members');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Team OG',
                        active: "home" });
});

router.get('/team', function(req, res, next){
    Members.find({}, function (err, result){
        res.render('team', {title: "Here are some dudes!", 
                            team: result,
                            active: "team"
                            });
    })
});

module.exports = router;
