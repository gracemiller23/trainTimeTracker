
// Initialize Firebase
    var config = {
        apiKey: "AIzaSyA8jJe3S04eH17mzA1WPKc8VM3Fz_ZkVyE",
        authDomain: "train-time-tracker-6dd9e.firebaseapp.com",
        databaseURL: "https://train-time-tracker-6dd9e.firebaseio.com",
        projectId: "train-time-tracker-6dd9e",
        storageBucket: "",
        messagingSenderId: "571618491750"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

//Pull info from form on submission and store in database

    $("#submit").on("click", function(){
        var formEntryTime = $("#train-start-time-input").val().trim();
        console.log(formEntryTime);
        if (moment(formEntryTime, "HH:mm", true).isValid()){
        event.preventDefault();

        var trainName = $("#train-name-input").val().trim();
        var trainDestination = $("#train-destination-input").val().trim();
        var firstTrainTime = $("#train-start-time-input").val().trim();
        var trainFrequency = $("#train-frequency-input").val().trim();

        console.log(trainName, trainDestination, firstTrainTime, trainFrequency);

        $("#train-name-input").val("");
        $("#train-destination-input").val("");
        $("#train-start-time-input").val("");
        $("#train-frequency-input").val("");

        var newTrain = {
            Name: trainName,
            Destination: trainDestination,
            Start: firstTrainTime,
            Frequency: trainFrequency
        }

        database.ref().push(newTrain);

        alert("Train successfully added!");
    }else{
        alert("Enter a valid time in military format, for example, 2:00 pm is 14:00.");
    };
    });
    

//Access train information in the database and add it as a new row to the table

    database.ref().on("child_added", function(childSnapshot, prevChildKey){

        //get the current time

        var currentTime = moment().unix();
        console.log(currentTime);

        //get other variables from the database

        var tName = childSnapshot.val().Name;
        var tDestination = childSnapshot.val().Destination;
        var firstTime = childSnapshot.val().Start;
        var tFrequency = childSnapshot.val().Frequency;

        //Calculate next arrival and minutes away
        var aTime = moment(firstTime, "HH:mm");
        var unixTime = moment(aTime).unix();

        var firstTimeUnix = unixTime - (tFrequency * 60)
    
        var timesRun = ((currentTime - firstTimeUnix) / 60) / tFrequency  ;
       
        var minutesGone = (timesRun % 1) * tFrequency;
       
        var minutesAway = Math.ceil(tFrequency - minutesGone);
        console.log(minutesAway);
        var secondsAway = minutesAway * 60;
       
        var nextUnixArrival = moment(currentTime + secondsAway);
        
        var nextArrival = moment.unix(nextUnixArrival).format("HH:mm");
        console.log(nextArrival);

        //display all info on table
        $("#train-schedule").append(
            "<tr> <td>" + tName + "</td>" + "<td>" + tDestination + "</td>" + "<td> Every " + tFrequency + " min.</td>" +
            "<td>" + nextArrival + "</td>" + "<td>" + minutesAway + "</td> </tr>"
        )

    });
