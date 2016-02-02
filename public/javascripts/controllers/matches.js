var teamApp = angular.module('teamPage', [])
teamApp.controller('matchesCntrl', function ($scope, $http){
    getItems = function(){
        $http.get('/api/items').success(function (items){
            $scope.items = items
            $scope.itemsLoaded = true
        });
    }

    $scope.getItemImg = function(itemId){

        if(itemId === 0){
            return '';
        }
        var thisItem = findItem(itemId);
        return thisItem.cdnImgURL
    }

    findItem = function (itemId){
        console.log(itemId);
        console.log($scope.items.filter(function(item){
            return item.id == itemId;
        }))
        return $scope.items.filter(function(item){
            return item.id == itemId;
        })[0];
    }
    $scope.itemsLoaded = false;

    getItems();

});
