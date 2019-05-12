// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyBcglHczC8EAYRVZr4Oenv-m9cgmvD9a5U",
    authDomain: "trainscheduler-a5f69.firebaseapp.com",
    databaseURL: "https://trainscheduler-a5f69.firebaseio.com",
    projectId: "trainscheduler-a5f69",
    storageBucket: "trainscheduler-a5f69.appspot.com",
    messagingSenderId: "132299499266",
    appId: "1:132299499266:web:b1e44f3fa9051fc1"
  };
  
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

//Button to add trains
$( "#target" ).submit(function(event) {

  	// Grab user input
  	var trainName = $("#train-input").val().trim();
  	var destinationName = $("#destination-input").val().trim();
  	var timeStart = moment($("#time-input").val().trim(), "HH:mm").format("X");
  	var frequencyRate = $("#frequency-input").val().trim();

  	// Creates object for holding train data
  	var newTrain = {
    	name: trainName,
    	destination: destinationName,
    	start: timeStart,
    	frequency: frequencyRate
  	};

	// Uploads train data to the database
	database.ref().push(newTrain);

	// Comfirmation
	alert("Train successfully added");

	// Clears text-boxes
	$("#train-input").val("");
	$("#destination-input").val("");
	$("#time-input").val("");
	$("#frequency-input").val("");

	// Determines when the next train arrives
  	return false;
});

//Firebase event to add train to the database and in the html
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

	// Store train info in variable.
	var trainName = childSnapshot.val().name;
	var destinationName = childSnapshot.val().destination;
	var timeStart = childSnapshot.val().start;
	var frequencyRate = childSnapshot.val().frequency;

	// First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(timeStart, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequencyRate;
    console.log(tRemainder);

     // Minutes until Train
    var tMinutesTillTrain = frequencyRate - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));
    var formattedTime = moment(nextTrain).format("HH:mm");

	// Add each train's data into the table
	$("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destinationName + "</td><td>" + frequencyRate + "</td><td>" + formattedTime + "</td><td>" + tMinutesTillTrain + "</td>");
});
