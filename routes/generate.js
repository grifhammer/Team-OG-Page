var express = require('express');
var router = express.Router();
var TeamMember = require('../models/team-members');
var Team = require('../models/team');
var vars = require('../config/vars.json');
var https = require('https');
var BigNumber = require("bignumber.js");

var steamKey = process.env.PROD_STEAM_KEY || vars.apiKey;

var getTeamBaseUrl = "https://api.steampowered.com/IDOTA2Match_570/GetTeamInfoByTeamID/v001/";
var getPlayerBaseURL = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/"

router.post('/team', function (req, res, next){

    // Fetch team data
    var getTeamEndpoint = getTeamBaseUrl + "?key="+ steamKey + "&start_at_team_id=" + req.body.teamId + "&teams_requested=1";

    https.get(getTeamEndpoint, function (res){
        res.on('data', function (data){
            dataJSON = JSON.parse(data)
            team = dataJSON.result.teams[0]
            console.log(team);
            var playerList = []
            var leagueList = []

            //currently there is no way to know how many players or leagues will be returned
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

            Team.findOneAndUpdate({id: req.body.teamId}, {  id: parseInt(req.body.teamId),
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

            //Insert players into the database
            playerList.forEach(function (player){
                insertPlayer(player);
            });

            leagueList.forEach(function (league) {
                insertLeagueMatches(league, req.body.teamId)
            });

            function insertPlayer(playerId){
                var steamId = new BigNumber(playerId).plus('76561197960265728');
                var getPlayerEndpoint = getPlayerBaseURL + "?key=" + steamKey + "&steamids="+ new BigNumber(playerId).plus('76561197960265728')
                https.get(getPlayerEndpoint, function (res){
                    res.on('data', function (data){
                        steamProfile = JSON.parse(data).response.players[0]
                        TeamMember.findOneAndUpdate({id: playerId}, {fullName: steamProfile.realname,
                                                                     tag: steamProfile.personaname, 
                                                                     age: steamProfile.timecreated, 
                                                                     nationality: steamProfile.loccountrycode, 
                                                                     position: "1",
                                                                     image: steamProfile.avatarfull},
                                                                     {upsert: true},
                                                                     function (error, result){
                                                                        // console.log(error);
                                                                        console.log(result);
                                                                     })

                    });

                });

            }

            function insertLeagueMatches(leagueId, teamId){

            }
            //Get league matches
                // Find ones that match team ID
                // store these matches in database
                // Store last parsed match somewhere

        });

    });
    // Fetch all player info
    // Insert Players into team DB
    res.redirect('/?teamId='+ req.body.teamId);
});

module.exports = router;
