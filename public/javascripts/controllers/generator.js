var teamApp = angular.module('teamPage', ['ngRoute'])
teamApp.config(function ($routeProvider, $locationProvider){
    $routeProvider.when('/generate/team', {
        templateUrl: 'views/team-edit.html',
        controller: 'teamEdit'
    }).
    when('/generate/players', {
        templateUrl: 'views/player-edit.html',
        controller: 'playerEdit'
    }).
    when('/generate/leagues', {
        emplateUrl: 'views/league-edit.html',
        controller: 'leagueEdit'
    })
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

