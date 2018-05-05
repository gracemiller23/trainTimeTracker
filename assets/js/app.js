
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

    });

//Access train information in the database and add it as a new row to the table

    database.ref().on("child_added", function(childSnapshot, prevChildKey){

        var tName = childSnapshot.val().Name;
        var tDestination = childSnapshot.val().Destination;
        var firstTime = childSnapshot.val().Start;
        var tFrequency = childSnapshot.val().Frequency;

        console.log(tName, tDestination, firstTime, tFrequency);

        //Calculate next arrival and minutes away
        var nextArrival = "Placeholder";
        var minutesAway = "Placeholder";


        $("#train-schedule").append(
            "<tr> <td>" + tName + "</td>" + "<td>" + tDestination + "</td>" + "<td>" + tFrequency + "</td>" +
            "<td>" + nextArrival + "</td>" + "<td>" + minutesAway + "</td> </tr>"
        )

    });
