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
