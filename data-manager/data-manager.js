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


MongooseManager.prototype.updatePlayer = function(player, callback){
  TeamMember.findOneAndUpdate({id: player.id},
                              {fullName: player.fullName,
                               tag: player.tag,
                               age: player.age,
                               nationality: player.nationality,
                               position: player.position,
                               image: player.image},
                               callback);
}

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

MongooseManager.prototype.updateTeam = function(team, callback){
    Team.findOneAndUpdate({id: team.id},
                          {id: team.id,
                           name: team.name,
                           tag: team.tag,
                           nationality: team.nationality,
                           logo: team.logo,
                           players: team.players,
                           leagues: team.leagues},
                           callback)
}

MongooseManager.prototype.insertMatch = function(match){
    var radiant_players = match.players.slice(0,5);
    var dire_players = match.players.slice(5,10);
    Match.findOneAndUpdate( {id: match.match_id},
                            {$set: {id: match.match_id,
                             radiant_id: match.radiant_team_id,
                             dire_id: match.dire_team_id,
                             radiant_name: match.radiant_name,
                             dire_name: match.dire_name,
                             dire_team: dire_players,
                             dire_items: match.players, 
                             radiant_team: radiant_players,
                             radiant_items: radiant_players, 
                             winner: match.radiant_win ? "Radiant": "Dire"}},
                             {upsert: true}, 
                             function (error, result){
                                if(error){
                                    console.log(error);
                                }
                             })
}

MongooseManager.prototype.resetDatabase = function(callback){
  Team.remove({}, function(err){ 
    if(err){
      console.log(err) 
    }
    callback();
  });
    
  TeamMember.remove({}, function(err){ 
    if(err){
      console.log(err) }
    });
  Match.remove({}, function(err){
    if(err){
      console.log(err)
    }  
  });
}

module.exports = MongooseManager