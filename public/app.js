// Get a reference to the database service
//let database = firebase.database();

/*function writeRoosterData(userId, name, calendar) {
  database.ref('cals/').set({
    username: name,
    cal: calendar
  });
};
*/



let app = angular.module('roosterApp', []);
  app.controller('RoosterAddController', ['$scope', '$http', function($scope, $http) {
    let name = document.getElementById("naamfield").value;
 /* app.controller('RoosterHttpGetController', ['$scope', function($scope) {*/
    //TODO link myUrl aan form in de app  
    let myUrl = 'https://ogd.rooster.nl/InPlanningService/ICalService?key=ly65f52k0kwu51u6xqav5xb627an283x';
    let proxy = 'https://cors-anywhere.herokuapp.com/';
      
    function getIcalData() {
        myUrl = document.getElementById("calUrl").value;
        icalData();
    };
      
    function icalData() {
        // The proxy url expects as first URL parameter the URL to be bypassed
        // https://cors-anywhere.herokuapp.com/{my-url-to-bypass}
        let req = {
            method: 'GET',
            url: proxy + myUrl,
            'Content-Type': 'text/plain'
        }; 
        $http(req)
        .then(function(response) {
            dataCal = response.data;
            //constants
            const REALDATE = 1;
            const ARRAYPOS = 1;
            //initial declarations
            let jCalData = ICAL.parse(dataCal);
            let comp = new ICAL.Component(jCalData);
            let tevent = comp.getAllSubcomponents("vevent");
            let calList = [];
            let count = 0;
            //for loop gets a new subcomponent and dissects the data which is then put into an object
            for(const arrValue of tevent) {
            //generate an ICAL event so that manipulating Ical data is easier
            let event = new ICAL.Event(arrValue);
            //manipulating some date objects, so that representation of dates is easier
            let dateJs = event.startDate.toJSDate()
            let niceDate = `${dateJs.getDate()}-${dateJs.getMonth()+REALDATE}-${dateJs.getFullYear()}`
            let dayOfWeek = (day) => {
                let days = ["Zondag","Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag"];
                return days[day]; 
            }
            //create a temporary dump object that is later pushed into the calList
            let dump = {
                summary: event.summary, 
                locatie: event.location, 
                dag: dayOfWeek(dateJs.getDay()), 
                datum: niceDate, 
                starttijd: `${event.startDate.hour}:${event.startDate.minute}`, 
                eindtijd: `${event.endDate.hour}:${event.endDate.minute}`};
            
            //Checks if the summary contains one of the customers, if so it replaces the location with the name of the customer
            if(dump.summary.match(/(BPD)|(FBNL)|(BIM)/g) !== null){
                dump.locatie = dump.summary.match(/(BPD)|(FBNL)|(BIM)/g).join("");
            };
            //Checks if the location matches Helvetios and if so changes it to Utrecht SSD
            if(dump.locatie.match(/Helvetios/g) !== null){
                dump.locatie = "Utrecht SSD";
            };
            //adds a 0 if the startdate/enddate ends in 0
            if(event.startDate.minute === 0){
                dump.starttijd += "0";
            }
            if(event.endDate.minute === 0){
                dump.eindtijd += "0";
            }
            //TODO iets in de logic klopt nog niet, bij de eerste dubbele entry lijkt hij niet de data samen te voegen 
            if(calList[calList.length-ARRAYPOS] !== undefined){    
                if(calList[calList.length-ARRAYPOS].data.datum === dump.datum){
                    calList[calList.length-ARRAYPOS].data.eindtijd = dump.eindtijd;

                }else{
                //create an object with an ID and the data attached  
                dump.werktijd = `${dump.starttijd} - ${dump.eindtijd}`;
                calList.push({id: count, data: dump});    
                count++;
                };
            
            }else{
            //create an object with an ID and the data attached   
            dump.werktijd = `${dump.starttijd} - ${dump.eindtijd}`;    
            calList.push({id: count, data: dump});    
            count++;
            };
            }; 
      /*  writeRoosterData(count, name, dump);*/
        console.log(calList);
        $scope.master = calList;
        }), function(response) {console.log("Error"); };
    }//)};
icalData();
}]);
     // }]);