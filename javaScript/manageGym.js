var db = firebase.database();
var dbGyms = db.ref('gyms');
var admin = "";

const auth = firebase.auth();

const user = auth.currentUser;
var uid = "";

auth.onAuthStateChanged((user) => {
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/firebase.User
		uid = user;
	}
	else {
		// TODOUser is signed out
	}
});

// create gym
document.getElementById('formGym').addEventListener('submit',(e) => 
{
    if(uid.uid != admin)
    {
        alert("You are not an admin");
    }
    else
    {
        //use the push function to add a new gym into the database, set holds the values, like an object
        var gymInfo = dbGyms.push();
        gymInfo.set({
            name: document.getElementById('name').value,
            capacity: document.getElementById('capacity').value,
            latitude: document.getElementById('latitude').value,
            longitude: document.getElementById('longitude').value
        });
    }

    e.preventDefault();

});

function listGyms()
{
    // just an example on how to list things from real time database
    dbGyms.on("value", function(snapshot) 
    {
        var gyms = "";
        var coordinates = [];
        snapshot.forEach(function(childSnapshot) 
        {
            var childData = childSnapshot.val();
            gyms = gyms + ", " + childData.name;

            //had to use parse to accept the number
            coordinates.push({ lat: parseFloat(childData.latitude), lng: parseFloat(childData.longitude) });
        });
        //saves the elements in the variable
        document.getElementById("list-gyms").innerHTML = gyms;

        initMap(coordinates);
    });
}

//function to show the geolocation map
function initMap(coordinates) 
{
    const map = new google.maps.Map(document.getElementById("map"), 
    {
        zoom: 14,
        center: coordinates[0],
    });

    //for each to add the pins to the map
    coordinates.forEach(coordinate => 
    {
        new google.maps.Marker({
            position: coordinate,
            map: map,
        });
    });
}

listGyms();

var usersRef = firebase.database().ref('Admin/');

usersRef.on("value", function (snapshot) 
{
    admin = snapshot.val();
});