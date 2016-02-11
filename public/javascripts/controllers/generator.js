
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

