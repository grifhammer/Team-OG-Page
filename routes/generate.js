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
            team = dataJSON.result.teams[0]
            console.log(team);
            var playerList = []
            var leagueList = []
            for(var i = 0; i < 10; i++){
                thisLeague = "league_id_" + i;
                thisPlayer = "player_" + i + "_account_id"
                if(team[thisPlayer]){
                    playerList.push(team[thisPlayer]);
                }
                if(team[thisLeague]){
                    leagueList.push(team[thisLeague]);
                }
            }
            console.log(playerList)
            console.log(leagueList)
            // Insert team into database

            Team.findOneAndUpdate({}, {  id: parseInt(req.body.teamId),
                                                            name: team.name,
                                                            tag: team.tag,
                                                            nationality: team.country_code,
                                                            logo: team.logo,
                                                            players: playerList,
                                                            leagues: leagueList }, {upsert: true},function (error, result){
                                                                if(error){
                                                                    console.log(error);
                                                                }
                                                            });
        });

    });
    // Fetch all player info
    // Insert Players into team DB
    res.redirect('/?teamId='+ req.body.teamId);
});

module.exports = router;
