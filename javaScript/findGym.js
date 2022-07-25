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
        var dropgym = document.getElementById("drop-gym");

        snapshot.forEach(function(childSnapshot) 
        {
            var childData = childSnapshot.val();
            gyms = gyms + ", " + childData.name;
            sessionStorage.setItem('capacity',childData.capacity);

            //had to use parse to accept the number
            coordinates.push({ lat: parseFloat(childData.latitude), lng: parseFloat(childData.longitude)});

            dropgym.options[dropgym.options.length] = new Option(childData.name, childData.name);
        });

        //event listener to change the capacity
        dropgym.addEventListener('change', function()
        {
            dbGyms.on("value", function(snapshot)
            {
                snapshot.forEach(function(childSnapshot)
                {
                    var childData = childSnapshot.val();

                    if(childData.name == dropgym.value)
                    {
                        sessionStorage.setItem('capacity', childData.capacity);
                    }
                });
            });
        });

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

function nextClick()
{
    var dropgym = document.getElementById("drop-gym");
    sessionStorage.setItem('selectedGym', dropgym.value);

    location.href = 'confirm.html'
}

listGymsforDropdown()
