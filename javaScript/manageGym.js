var db = firebase.database();
var dbGyms = db.ref('gyms');

// create gym
document.getElementById('formGym').addEventListener('submit',(e) => 
{
    e.preventDefault();

    var gymInfo = dbGyms.push();
    gymInfo.set({
        name: document.getElementById('name').value,
        capacity: document.getElementById('capacity').value,
        latitude: document.getElementById('latitude').value,
        longitude: document.getElementById('longitude').value
    });
});

function listGyms()
{
    // just an example on how to list things from real time database
    dbGyms.on("value", function(snapshot) {
        var gyms = "";
        var coordinations = [];
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            gyms = gyms + ", " + childData.name;
            coordinations.push({ lat: parseFloat(childData.latitude), lng: parseFloat(childData.longitude) });
        });
        document.getElementById("list-gyms").innerHTML = gyms;
        initMap(coordinations);
    });
}

function initMap(coordinations) {
    
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: coordinations[0],
    });

    coordinations.forEach(coordination => {
        new google.maps.Marker({
            position: coordination,
            map: map,
        });
    });
}

listGyms();
//window.initMap = initMap;