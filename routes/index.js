var express = require('express');
var router = express.Router();
var Members = require('../models/team-members');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Team OG' });
});

router.get('/team', function(req, res, next){
    Members.find({}, function (err, result){
        console.log(result);
        res.render('team', {title: "Here are some dudes!", 
                            team: result
                            });
    })
    // res.render('team', {title: "Heres the Team"})
});

module.exports = router;
