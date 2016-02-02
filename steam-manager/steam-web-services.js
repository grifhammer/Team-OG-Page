var https = require('https');
var RateLimiter = require('limiter').RateLimiter;
var BigNumber = require("bignumber.js");
var DataManager = require('../data-manager')

var limiter = new RateLimiter(10, 'second');
DataManager = new DataManager;


var getTeamBaseUrl = "https://api.steampowered.com/IDOTA2Match_570/GetTeamInfoByTeamID/v001/";
var getMatchesBaseURL = "https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v001/";
var getMatchDetailsBaseURL = "https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v001/";
var getPlayerBaseURL = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/"
var getItemsBaseURL = "https://api.steampowered.com/IEconDOTA2_570/GetGameItems/V001/"
var getHeroesBaseURL = "https://api.steampowered.com/IEconDOTA2_570/GetHeroes/V001/"

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
    var currLeague = '0';
    while(teamObj['league_id_'+ currLeague]){
        leagueList.push(teamObj['league_id_'+ currLeague])
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
    var getLeagueMatchesEndpoint = getMatchesBaseURL + "?key=" + this.steamKey + "&league_id="+ league;

    var self = this;

    https.get(getLeagueMatchesEndpoint, function (res){
        var body = ''
        res.on('data', function (data){
            body += data;
        });
        res.on('end', function(){
            var matches = JSON.parse(body).result.matches;
            matches.forEach(function (match){
                if(match.radiant_team_id == teamId ||
                    match.dire_team_id == teamId){
                    limiter.removeTokens(1, function(){
                        self.getMatchDetails(match.match_id);
                    });
                }
            });
        });
    });
}

SteamManager.prototype.getItemList = function(){
    var getItemsEndpoint = getItemsBaseURL + "?key=" + this.steamKey + "&language=en"

    https.get(getItemsEndpoint, function (res){
        var body = ""
        res.on('data', function (data){
            body += data;
        });
        res.on('end', function(){
            var items = JSON.parse(body).result.items;
            items.forEach(function (item){
                DataManager.insertItem(item);
            })
        });
    })
}

SteamManager.prototype.getHeroList = function(){
    var getHeroesEndpoint = getHeroesBaseURL + "?key=" + this.steamKey + "&language=en"
    https.get(getHeroesEndpoint, function (res){
        var body = ""
        res.on('data', function (data){
            body += data;
        });
        res.on('end', function(){
            var heroes = JSON.parse(body).result.heroes;
            heroes.forEach(function (hero){
                DataManager.insertHero(hero);
            })
        });
    })
}

SteamManager.prototype.getMatchDetails = function(matchId){
    var getMatchDetailsEndpoint = getMatchDetailsBaseURL + "?key=" + this.steamKey + "&match_id=" + matchId
    https.get(getMatchDetailsEndpoint, function (res){
        var body = ''
        res.on('data', function (data){
            body += data;
        });
        res.on('end', function (){
            var matchDetails = JSON.parse(body).result;
            DataManager.insertMatch(matchDetails);
        });
    })
}

SteamManager.prototype.buildTeamData = function(teamId){
    
    var getTeamEndpoint = getTeamBaseUrl + "?key="+ this.steamKey + "&start_at_team_id=" + teamId + "&teams_requested=1";
    console.log(getTeamEndpoint);
    var self = this;
    https.get(getTeamEndpoint,function (res){
            res.on('data', function (data){
                dataJSON = JSON.parse(data);
                team = dataJSON.result.teams[0];

                var playerList = self.buildPlayerList(team);

                var leagueList = self.buildLeagueList(team);
                
                team.playerList = playerList;
                team.leagueList = leagueList;
                console.log(playerList);
                console.log(leagueList);
                DataManager.insertTeam(team);

                playerList.forEach(function (player){
                    limiter.removeTokens(1, function(){
                        self.buildPlayerData(player);
                    });
                });

                leagueList.forEach(function (league){
                    limiter.removeTokens(1, function(){
                        self.findTeamMatches(league, teamId);
                    })
                });

            });
        });
}

module.exports = SteamManager
