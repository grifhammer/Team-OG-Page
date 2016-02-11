var express = require('express');
var router = express.Router();
var SteamManager = require('../steam-manager/');
if(!process.env.PROD_STEAM_KEY){
    var vars = require('./config/vars.json');
}
var steamKey = process.env.PROD_STEAM_KEY || vars.apiKey;

SteamManager = new SteamManager(steamKey);


router.post('/team', function (req, res, next){

    // Fetch team data
    SteamManager.buildTeamData(req.body.teamId);

    res.redirect('/?teamId='+ req.body.teamId);
});


module.exports = router;
