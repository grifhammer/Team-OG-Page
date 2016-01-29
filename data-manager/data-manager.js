var TeamMember = require('../models/team-members');
var Team = require('../models/team');
var Match = require('../models/match')

function MongooseManager(){
    return this;
}

MongooseManager.prototype.insertPlayer = function(steamProfile) {
    TeamMember.findOneAndUpdate({id: steamProfile.steamid},
                                {fullName: steamProfile.realname,
                                 tag: steamProfile.personaname,
                                 age: steamProfile.timecreated,
                                 nationality: steamProfile.loccountrycode,
                                 position: "Unknown",
                                 image: steamProfile.avatarfull},
                                {upsert: true},
                                function(error, result){
                                    if(error){
                                        console.log(error);
                                    }
                                });
};

MongooseManager.prototype.insertTeam = function(team){
    Team.findOneAndUpdate({id: team.team_id},
                          {id: team.team_id,
                           name: team.name,
                           tag: team.tag,
                           nationality: team.country_code,
                           logo: team.logo,
                           players: team.playerList,
                           leagues: team.leagueList},
                          {upsert: true},
                          function (error, result){
                            if(error){
                                return error;
                            }
                          })
}

MongooseManager.prototype.insertMatch = function(match){
    Match.findOneAndUpdate( {id: match.match_id},
                            {id: match.match_id,
                             radiant_id: match.radiant_team_id,
                             dire_id: match.dire_team_id,
                             dire_team: match.players,
                             dire_items: match.players, 
                             radiant_team: [],
                             radiant_items: [], 
                             winner: "dire"},
                             {upsert: true}, 
                             function (error, result){
                                if(error){
                                    console.log(error);
                                }
                                console.log(result);
                             })
}

module.exports = MongooseManager