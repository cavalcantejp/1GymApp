var db = firebase.database();
var dbGyms = db.ref('gyms');
var admin = "";

const auth = firebase.auth();

const user = auth.currentUser;
var uid = "";
var userSession = null;

auth.onAuthStateChanged((user) => {
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/firebase.User
		uid = user;
        userSession = user;
	}
	else {
		// TODOUser is signed out
	}
});

// create gym
document.getElementById('formGym').addEventListener('submit',(e) => 
{

    var gymInfo = dbGyms.push();
        gymInfo.set({
            name: document.getElementById('name').value,
            capacity: document.getElementById('capacity').value,
            latitude: document.getElementById('latitude').value,
            longitude: document.getElementById('longitude').value
        });

    // if(uid.uid != admin)
    // {
    //     alert("You are not an admin");
    // }
    // else
    // {
    //     //use the push function to add a new gym into the database, set holds the values, like an object
    //     var gymInfo = dbGyms.push();
    //     gymInfo.set({
    //         name: document.getElementById('name').value,
    //         capacity: document.getElementById('capacity').value,
    //         latitude: document.getElementById('latitude').value,
    //         longitude: document.getElementById('longitude').value
    //     });
    // }

    // e.preventDefault();

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
            //gyms = gyms + ", " + childData.name;

            var newGym = {}
            newGym.title = childData.name; 
            newGym.coordinates = {lat: parseFloat(childData.latitude), lng: parseFloat(childData.longitude)};

            //had to use parse to accept the number
            coordinates.push(newGym);
            console.log(coordinates);
        });
        //saves the elements in the variable
        //document.getElementById("list-gyms").innerHTML = gyms;

        initMap(coordinates);
    });
}

//function to show the geolocation map
function initMap(coordinates) 
{
    const map = new google.maps.Map(document.getElementById("map"), 
    {
        zoom: 14,
        center: coordinates[0].coordinates,
    });

    //for each to add the pins to the map
    coordinates.forEach(coordinate => 
    {
        new google.maps.Marker({
            position: coordinate.coordinates,
            map: map,
            title: coordinate.title
        });
    });
}

listGyms();

var usersRef = firebase.database().ref('Admin');

usersRef.on("value", function (snapshot) 
{
    admin = snapshot.val();
});