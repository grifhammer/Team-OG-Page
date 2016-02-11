var teamApp = angular.module('teamPage', [])

teamApp.controller('matchesCntrl', function ($scope, $http){
    getItems = function(){
        $http.get('/api/items').success(function (items){
            $scope.items = items
            $scope.itemsLoaded = true
        });
    }

    getHeroes = function(){
        $http.get('/api/heroes').success(function (heroes){
            $scope.heroes = heroes
            $scope.heroesLoaded = true
        })
    }

    $scope.getItemImg = function(itemId){

        if(itemId === 0){
            return '';
        }
        var thisItem = findItem(itemId);
        return thisItem.cdnImgURL
    }

    findItem = function (itemId){
        return $scope.items.filter(function(item){
            return item.id == itemId;
        })[0];
    }

    findHero = function (heroId){
        return $scope.heroes.filter(function(hero){
            return hero.id == heroId;
        })[0];
    }

    $scope.getHeroImg = function(heroId){
        return findHero(heroId).cdnImgURL
    }

    $scope.itemsLoaded = false;
    $scope.heroesLoaded = false;

    getItems();
    getHeroes();

});

teamApp.controller('pageGenerationCntrl', function ($scope, $http){

    $scope.section = "Team"

    $scope.submitPlayers = function(){
        console.log($scope.teamMembers);
        $http.post('/api/players', {players: $scope.teamMembers}).success(function() {
            $scope.teamEdited = true;
        }); 
    }

    $scope.deleteTeam = function(){
        // add code to warn user of this act being unreversable
        $http.post('api/delete', {deleteAuth: true});
    }

    $scope.submitTeam = function(){
        $http.post('/api/team', {team: $scope.team});
    }

});


