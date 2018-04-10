// Get a reference to the database service
//let database = firebase.database();

/*function writeRoosterData(userId, name, calendar) {
  database.ref('cals/').set({
    username: name,
    cal: calendar
  });
};
*/



angular.module('roosterApp', []);
    angular.module('roosterApp').factory('httpCall', ['$http', function($http){
    
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

angular.module('roosterApp').controller('RoosterAddController', ['$scope', '$http', 'httpCall', function($scope, $http, httpCall) { 
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
            function createDataInstance(){
                let event = new ICAL.Event(arrValue);
                //manipulating some date objects, so that representation of dates is easier
                let dateJs = event.startDate.toJSDate();
                const REALDATE = 1;
                let niceDate = `${dateJs.getDate()}-${dateJs.getMonth()+REALDATE}-${dateJs.getFullYear()}`;
                let dayOfWeek = (day) => {
                    let days = ["Zondag","Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag"];
                    return days[day]; 
                };
                
            //create a temporary dump object that is later pushed into the calList
                let dump = {
                    summary: event.summary, 
                    locatie: event.location, 
                    dag: dayOfWeek(dateJs.getDay()), 
                    datum: niceDate, 
                    starttijd: `${event.startDate.hour}:${event.startDate.minute}`, 
                    eindtijd: `${event.endDate.hour}:${event.endDate.minute}`
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
                //adds a 0 if the startdate/enddate ends in 0
                if(item.starttijd.match(/$:\d{1}\z/g) !== null){
                     item.starttijd += "0";
                    console.log("test");
                };
                item.eindtijd.toString();
                if(item.eindtijd.match(/:\d{1}\z/g) !== null){
                     item.eindtijd += "0";
                    console.log("test1");
                };
                return item;
            };
            function checkArray(item){
            const ARRAYPOS = 1;
            //TODO iets in de logic klopt nog niet, bij de eerste dubbele entry lijkt hij niet de data samen te voegen 
            if(calList[calList.length-ARRAYPOS] !== undefined){    
                if(calList[calList.length-ARRAYPOS].data.datum === item.datum){
                    calList[calList.length-ARRAYPOS].data.eindtijd = item.eindtijd;

                }else{
                //create an object with an ID and the data attached  
                item.werktijd = `${item.starttijd} - ${item.eindtijd}`;
                calList.push({id: count, data: item});    
                count++;
                };

            }else{
            //create an object with an ID and the data attached   
            item.werktijd = `${item.starttijd} - ${item.eindtijd}`;    
            calList.push({id: count, data: item});    
            count++;
            };
            };
            checkArray(checkList(createDataInstance()));
        }; 
        $scope.master = calList;
        };
        dataSetCreator();
         
    });
    
            
}]);
    