var https = require('https');
var BigNumber = require("bignumber.js");
var DataManager = require('../data-manager')
DataManager = new DataManager;



var getTeamBaseUrl = "https://api.steampowered.com/IDOTA2Match_570/GetTeamInfoByTeamID/v001/";
var getPlayerBaseURL = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/"

function SteamManager(steamKey){
    this.steamKey = steamKey;
}

SteamManager.prototype.buildPlayerList = function(teamObj){
    var playerList = []
    var currPlayer = 0;
    while(teamObj['player_'+ currPlayer + '_account_id']){
        playerList.push(teamObj['player_'+ currPlayer + '_account_id'])
        currPlayer++;
    }
    return playerList
}

SteamManager.prototype.buildLeagueList = function(teamObj){
    var leagueList = []
    var currLeague = 0;
    while(teamObj['league_id_'+ currLeague]){
        leagueList.push(teamObj['league_id_'+ currLeague ])
        currLeague++;
    }
    return leagueList
}

SteamManager.prototype.buildPlayerData = function(playerId){
    var steamId = new BigNumber(playerId).plus('76561197960265728');
    var getPlayerEndpoint = getPlayerBaseURL + "?key=" + this.steamKey + "&steamids="+ new BigNumber(playerId).plus('76561197960265728')
    https.get(getPlayerEndpoint, function (res){
        res.on('data', function (data){
            steamProfile = JSON.parse(data).response.players[0]
            DataManager.insertPlayer(steamProfile);
        });
    });
}

SteamManager.prototype.findTeamMatches = function (league, teamId){

}

SteamManager.prototype.buildTeamData = function(teamId){
    
    var getTeamEndpoint = getTeamBaseUrl + "?key="+ this.steamKey + "&start_at_team_id=" + teamId + "&teams_requested=1";

    var self = this;

    https.get(getTeamEndpoint, function (self){
        return function (res){
            res.on('data', function (data){
                dataJSON = JSON.parse(data);
                team = dataJSON.result.teams[0];

                var playerList = self.buildPlayerList(team);

                var leagueList = self.buildLeagueList(team);
                
                team.playerList = playerList;
                team.leagueList = leagueList;
                
                DataManager.insertTeam(team);

                playerList.forEach(function (player){
                    self.buildPlayerData(player);
                });

                leagueList.forEach(function (league){
                    self.findTeamMatches(league, teamId);
                });

            });
        };
    }(self));
}

module.exports = SteamManager