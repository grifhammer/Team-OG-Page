var TeamMember = require('../models/team-members');
var Team = require('../models/team');

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
                                })
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

module.exports = MongooseManager