var db = firebase.database();
var dbGyms = db.ref('gyms');

function listGymsforDropdown()
{
    // just an example on how to list things from real time database
    // gonna be used on the dropdown button
    dbGyms.on("value", function(snapshot) 
    {
        var gyms = "";
        var coordinates = [];
        snapshot.forEach(function(childSnapshot) 
        {
            var childData = childSnapshot.val();
            gyms = gyms + ", " + childData.name;

            //had to use parse to accept the number
            coordinates.push({ lat: parseFloat(childData.latitude), lng: parseFloat(childData.longitude)});
        });
        //saves the elements in the variable
        //TODO search how to link the listed gyms to the dropdown button
        document.getElementById("drop-gym").innerHTML = gyms;
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

    //enter location
    const input = document.getElementById("pac-input");
    const searchBox = new google.maps.places.SearchBox(input);

    searchBox.addListener("places_changed", () => 
    {
        const places = searchBox.getPlaces();
        if (places.length == 0) 
    {
        return;
    }
        map.panTo(places[0].geometry.location);
    });
}

listGymsforDropdown()
