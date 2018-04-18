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
    app.factory('httpCall', ['$http', function($http){
    
        // The proxy url expects as first URL parameter the URL to be bypassed
        // https://cors-anywhere.herokuapp.com/{my-url-to-bypass}
        let myUrl = 'https://ogd.rooster.nl/InPlanningService/ICalService?key=ly65f52k0kwu51u6xqav5xb627an283x';
        let proxy = 'https://cors-anywhere.herokuapp.com/';
        let req = {
            method: 'GET',
            url: proxy + myUrl,
            'Content-Type': 'text/plain',
            cache: true
        }; 
        return $http(req).then(function(response) {
            console.log("Success");
            return response.data;
            });   
        }]);
    app.controller('RoosterAddController', ['$scope', '$http', 'httpCall', function($scope, $http, httpCall) { 
    $scope.loading = true;  
    $scope.gui = false;
    $scope.updateBox = false;
    httpCall.then(function(successResponse){
        $scope.callback = successResponse;
        function convertData(con){
            let jCalData = ICAL.parse(con);
            let comp = new ICAL.Component(jCalData);
            let tevent = comp.getAllSubcomponents("vevent");
            return tevent;
        };   
        function dataSetCreator(){ 
        let calList = [];
        let count = 0;
        //for loop gets a new subcomponent and dissects the data which is then put into an object
        for(const arrValue of convertData($scope.callback)) {
            //generate an ICAL event so that manipulating Ical data is easier
            let dayOfWeek = (day) => {
                    let days = ["Zondag","Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag"];
                    return days[day]; 
                };
            function createDataInstance(){
                let event = new ICAL.Event(arrValue);
                //manipulating some date objects, so that representation of dates is easier
                let dateJs = event.startDate.toJSDate();
                const REALDATE = 1;
                function addZero(i) {
                    if (i < 10) {
                        i = "0" + i;
                    }
                    return i;
                }
                function makeTime(t){
                    let h = addZero(t.getHours());
                    let m = addZero(t.getMinutes());66
                    return `${h}:${m}`;
                }
                function makeDate(d){
                    let day = d.getDate();
                    let month = d.getMonth()+REALDATE;
                    let year = d. getFullYear();
                    return `(${day}-${month}-${year})`;
                }

                
            //create a temporary dump object that is later pushed into the calList
                let dump = {
                    summary: event.summary, 
                    locatie: event.location, 
                    dag: dayOfWeek(dateJs.getDay()),
                    dagInNo: dateJs.getDay(), 
                    datum: makeDate(dateJs), 
                    starttijd: makeTime(dateJs), 
                    eindtijd: makeTime(event.endDate.toJSDate()),
                    werktijd: ""
                };
                return dump;
            };           
            function checkList(item){    
            //Checks if the summary contains one of the customers, if so it replaces the location with the name of the customer
                if(item.summary.match(/(BPD)|(FBNL)|(BIM)/g) !== null){
                     item.locatie = item.summary.match(/(BPD)|(FBNL)|(BIM)/g).join("");
                };
                //Checks if the location matches Helvetios and if so changes it to Utrecht SSD
                if(item.locatie.match(/Helvetios/g) !== null){
                     item.locatie = "Utrecht SSD";
                };
                return item;
            };
            
            function checkArray(item){     
            const ARRAYPOS = 1;
          
            //TODO iets in de logic klopt nog niet, bij de eerste dubbele entry lijkt hij niet de data samen te voegen 
            if(calList[calList.length-ARRAYPOS] !== undefined){
            let prevDate = calList[calList.length-ARRAYPOS].data;  
            const DAYMINUS = 1;
                if(prevDate.dagInNo !== (item.dagInNo-DAYMINUS) && prevDate.dagInNo !== (item.dagInNo) && item.dagInNo !== 1){
                   calList.push({data: {
                    summary: event.summary, 
                    locatie: "Niet aanwezig", 
                    dagInNo: item.dagInNo - DAYMINUS,
                    dag: dayOfWeek(item.dagInNo - DAYMINUS),
                    datum: "",
                    starttijd: "", 
                    eindtijd: "",
                    werktijd: ""
                }});
                    console.log(calList.indexOf(item) + `  ${item.dag}  ${item.datum}`);
                }
                if(prevDate.datum === item.datum){
                    prevDate.eindtijd = item.eindtijd;
                    prevDate.werktijd = `${prevDate.starttijd} - ${item.eindtijd}`

                }else{
                //create an object with an ID and the data attached  
                item.werktijd = `${item.starttijd} - ${item.eindtijd}`;
                calList.push({data: item});    
                count++;
                };

            }else{
            //create an object with an ID and the data attached   
            item.werktijd = `${item.starttijd} - ${item.eindtijd}`;    
            calList.push({data: item});    
            count++;
            };
            };
            checkArray(checkList(createDataInstance()));
        };    
        $scope.master = calList;
        };
        dataSetCreator();

        $scope.myName = "Sascha";
    }, function ( response ) {
    console.log("HALP SOMETHING WENT WRONG!" + response);
  }).finally(function() {
        $scope.loading = false;
        $scope.gui = true;
    }); 
    
    $scope.saveClKlant = function(index){    
        $scope.master[index].name = $scope.myName;
        console.log($scope.master[index]);
        
        $scope.result = `Succesvol ${$scope.master[index].data.klant}, ${$scope.master[index].data.rol} en  ${$scope.master[index].data.pauze} aangepast voor ${$scope.myName} op ${$scope.master[index].data.datum}`
        $scope.updateBox = true;
    }    
    }]);
    app.controller('RoosterOptionsCtrl', ['$scope', function($scope) { 
    $scope.rollen = ["Scout","Chaser","Gatekeeper","Kennis","Pixiecoach","Bootcamp"];
    $scope.klanten = {"BPD": "BPD","BIM": "BIM","FBNL": "FBNL","BIV": "BIV"};
    $scope.pauzes = ["12:00","12:30","13:00", "13:30"];
}]);
    app.controller('ctrlIndex', function(){
    let ci = this;
    ci.numRecords = 5;
    ci.page = 1;
    ci.next = function(){
        ci.page = ci.page + 1;
    };

    ci.back = function(){
        ci.page = ci.page - 1;
    };
});
