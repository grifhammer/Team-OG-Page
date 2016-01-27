var express = require('express');
var router = express.Router();
var Members = require('../models/team-members');
var Team = require('../models/team');
var vars = require('../config/vars.json');
var https = require('https');

var steamKey = process.env.PROD_STEAM_KEY || vars.apiKey;

var getTeamBaseUrl = "https://api.steampowered.com/IDOTA2Match_570/GetTeamInfoByTeamID/v001/";


router.post('/team', function (req, res, next){
    console.log(req.body);

    // Fetch team data
    var getTeamEndpoint = getTeamBaseUrl + "?key="+ steamKey + "&start_at_team_id=" + req.body.teamId + "&teams_requested=1";

    https.get(getTeamEndpoint, function (res){
        res.on('data', function (data){
            dataJSON = JSON.parse(data)
            // console.log(dataJSON)
            team = dataJSON.result.teams[0]
            console.log(parseInt(req.body.teamId));
            Team.findOneAndUpdate({}, {  id: parseInt(req.body.teamId),
                                                            name: team.name,
                                                            tag: team.tag,
                                                            nationality: team.country_code,
                                                            logo: team.logo }, {upsert: true},function (error, result){
                                                                if(error){
                                                                    console.log(error);
                                                                }
                                                                console.log(result);
                                                            })
        });

    });
    // Insert team into database
    // Fetch all player info
    // Insert Players into team DB
    res.redirect('/?teamId='+ req.body.teamId);
});

module.exports = router;
