// Get a reference to the database service
/*let database = firebase.database();

function writeRoosterData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
};*/




var app = angular.module('roosterApp', []);
  app.controller('RoosterAddController', ['$scope', '$http', function($scope, $http) {

    var roosterList = this;
    roosterList.addcal = function() {
        $scope.master.push({naamfield, roosterUrl, werkTijd, pauze});
        
    };

  

 /* app.controller('RoosterHttpGetController', ['$scope', function($scope) {*/
    let myUrl = 'https://ogd.rooster.nl/InPlanningService/ICalService?key=ly65f52k0kwu51u6xqav5xb627an283x';
    let proxy = 'https://cors-anywhere.herokuapp.com/';
    function getIcalData() {
        myUrl = document.getElementById("calUrl").value;
        icalData();
    }
    function icalData() {
        // The proxy url expects as first URL parameter the URL to be bypassed
        // https://cors-anywhere.herokuapp.com/{my-url-to-bypass}
        let req = {
            method: 'GET',
            url: proxy + myUrl,
            'Content-Type': 'text/plain'
        }; 
        console.log(req.url);
        $http(req)
        .then(function(response) {
            dataCal = response.data;
            let jCalData = ICAL.parse(dataCal);
            let comp = new ICAL.Component(jCalData);
            let tevent = comp.getAllSubcomponents("vevent");
            let calList = [];
            let count = 0;
            console.log(tevent);
            for(const arrValue of tevent) {
            let event = new ICAL.Event(arrValue);
            let dump = {summary: event.summary, locatie: event.location, datum: event.startDate.day + "-" + event.startDate.month, starttijd: event.startDate.hour + ":"+ event.startDate.minute, eindtijd: event.endDate.hour + ":"+ event.endDate.minute };
            
            
            if(dump.summary.match(/(BPD)|(FBNL)|(BIM)/g) !== null){
                dump.locatie = dump.summary.match(/(BPD)|(FBNL)|(BIM)/g).join("");
           };
            if(dump.locatie.match(/Helvetios/g) !== null){
                dump.locatie = "Utrecht SSD";
           };
            if(event.startDate.minute === 0){
                dump.starttijd += "0";
            }
            if(event.endDate.minute === 0){
                dump.eindtijd += "0";
            }
           
        calList.push({id: count, data: dump});    
        count++;
               
            } 
        console.log(calList);
        $scope.master = calList;
        }), function(response) {console.log("Error"); };
    }//)};
icalData();
}]);
     // }]);