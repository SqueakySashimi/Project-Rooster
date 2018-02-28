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
        maandag:
        {
        p1:
        {naamfield:"Marissa", roosterUrl: "test", werkTijd: "9:00-17:00", pauze: "12:00"},
        p2:
        {naamfield:"Ruud", roosterUrl: "test", werkTijd: "9:00-17:00", pauze: "12:00"},
        p3:
        {naamfield:"Sascha", roosterUrl: "test", werkTijd: "9:00-17:00", pauze: "12:00"},
        p4:
        {naamfield:"Abel", roosterUrl: "test", werkTijd: "9:00-17:00", pauze: "12:00"},
        p5:
        {naamfield:"Ferdinand", roosterUrl: "test", werkTijd: "9:00-17:00", pauze: "12:00"}},
        dinsdag:
        {
        p1:
        {naamfield:"Marissa", roosterUrl: "test", werkTijd: "9:00-17:00", pauze: "12:00"},
        p2:
        {naamfield:"Ruud", roosterUrl: "test", werkTijd: "9:00-17:00", pauze: "12:00"},
        p3:
        {naamfield:"Sascha", roosterUrl: "test", werkTijd: "9:00-17:00", pauze: "12:00"},
        p4:
        {naamfield:"Abel", roosterUrl: "test", werkTijd: "9:00-17:00", pauze: "12:00"},
        p5:
        {naamfield:"Ferdinand", roosterUrl: "test", werkTijd: "9:00-17:00", pauze: "12:00"}},
    };
    var roosterList = this;
    roosterList.addcal = function() {
        $scope.master.push({naamfield, roosterUrl, werkTijd, pauze});
    };

  });