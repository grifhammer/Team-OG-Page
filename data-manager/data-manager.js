var TeamMember = require('../models/team-members');
var Team = require('../models/team');
var Match = require('../models/match')
var Item = require('../models/item')
var Hero = require('../models/hero')

function MongooseManager(){
    return this;
}

MongooseManager.prototype.insertPlayer = function(steamProfile) {
    TeamMember.findOneAndUpdate({id: steamProfile.steamid},
                                {fullName: steamProfile.realname,
                                 tag: steamProfile.personaname,
                                 age: steamProfile.lastlogoff,
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

MongooseManager.prototype.insertItem = function(item){
    // remove 'item_' from front of item name in order to use it to get images
  var cdnImgURL = "http://cdn.dota2.com/apps/dota2/images/items/" + item.name.slice(5,item.name.length) + "_lg.png";
  Item.findOneAndUpdate({id: item.id},
                        {id: item.id,
                         itemName: item.name,
                         localizedName: item.localized_name,
                         cost: item.cost,
                         cdnImgURL: cdnImgURL},
                         {upsert: true},
                         function (error, result){
                          if(error){
                            console.log(error);
                          }
                         });
}

MongooseManager.prototype.insertHero = function(hero){
    // remove 'item_' from front of item name in order to use it to get images
    var cdnImgURL = "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.name.slice(14,hero.name.length) + "_lg.png";
  Hero.findOneAndUpdate({id: hero.id},
                        {id: hero.id,
                         heroName: hero.name,
                         localizedName: hero.localized_name,
                         cdnImgURL: cdnImgURL},
                         {upsert: true},
                         function (error, result){
                          if(error){
                            console.log(error);
                          }
                          console.log(result);
                         });
}

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
    var dire_players = match.players.slice(0,5);
    var radiant_players = match.players.slice(5,10);
    console.log(match.radiant_win);
    Match.findOneAndUpdate( {id: match.match_id},
                            {$set: {id: match.match_id,
                             radiant_id: match.radiant_team_id,
                             dire_id: match.dire_team_id,
                             dire_team: dire_players,
                             dire_items: match.players, 
                             radiant_team: radiant_players,
                             radiant_items: radiant_players, 
                             winner: match.radiant_win ? "radiant": "dire"}},
                             {upsert: true}, 
                             function (error, result){
                                if(error){
                                    console.log(error);
                                }
                             })
}

module.exports = MongooseManager