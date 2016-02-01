angular.module('teamPage', []).controller('matchesCntrl', function($scope){
    $scope.$evalAsync(function(){
        console.log($scope.matches + ' logging');
    });
});