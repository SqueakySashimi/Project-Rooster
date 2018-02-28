// Get a reference to the database service
/*let database = firebase.database();

function writeRoosterData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}*/

var app = angular.module('roosterApp', [])
  app.controller('RoosterAddController', function($scope) {
    $scope.master = {
        one:
        {naamfield:"test", roosterUrl: "test"},
        two:
        {naamfield:"test", roosterUrl: "test"},
        three:
        {naamfield:"test", roosterUrl: "test"}};
    var roosterList = this;
    roosterList.addcal = function() {
        $scope.master.push({naamfield, roosterUrl});
    };

  });