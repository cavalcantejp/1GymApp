var db = firebase.database();
var dbGyms = db.ref('gyms');

function listGymsforDropdown() {
    // just an example on how to list things from real time database
    // gonna be used on the dropdown button
    dbGyms.on("value", function (snapshot) {
        var gyms = "";
        var coordinates = [];
        var dropgym = document.getElementById("drop-gym");

        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
    
            gyms = gyms + ", " + childData.name;

            //had to use parse to accept the number
            coordinates.push({ lat: parseFloat(childData.latitude), lng: parseFloat(childData.longitude) });

            dropgym.options[dropgym.options.length] = new Option(childData.name, childData.name);
        });

        //event listener to change the capacity
        dropgym.addEventListener('change', function () {
            if(this.value != "default")
            {document.getElementById('nextButton').disabled = false}
            dbGyms.on("value", function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    var childData = childSnapshot.val();

                    if (childData.name == dropgym.value) {
                        sessionStorage.setItem('capacity', childData.capacity);
                    }
                });
            });
        });

        //add ratings
        var currentGym = document.getElementById("drop-gym").value;
        addRatings(currentGym);

        initMap(coordinates);
    });
}


//function to show the geolocation map
function initMap(coordinates) {
    const map = new google.maps.Map(document.getElementById("map"),
        {
            zoom: 14,
            center: coordinates[0],
        });

    //for each to add the pins to the map
    coordinates.forEach(coordinate => {
        new google.maps.Marker({
            position: coordinate,
            map: map,
        });
    });

    //enter location
    const input = document.getElementById("pac-input");
    const searchBox = new google.maps.places.SearchBox(input);

    searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }
        map.panTo(places[0].geometry.location);
    });
}

function nextClick() {
    var dropgym = document.getElementById("drop-gym");
    sessionStorage.setItem('selectedGym', dropgym.value);

    location.href = 'confirm.html'
}

listGymsforDropdown()

const auth = firebase.auth();

const user = auth.currentUser;

auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        document.getElementById('myuser').innerHTML = "Logged in as: " + user.email + " ";
    } else {
        // User is signed out
        // ...
    }
});

//getting gym value on drop down and call the function
document.getElementById("drop-gym").addEventListener("click", function () {
    var currentGym = document.getElementById("drop-gym").value;

    addRatings(currentGym);
});

//when select the gym it brings the rating for that gym
function addRatings(gym) {
    var ratingsRef = firebase.database().ref('ratings/');

    //remove all the rating from the div
    ratingsdiv = document.getElementById('ratings');
    while (ratingsdiv.firstChild) {
        ratingsdiv.removeChild(ratingsdiv.lastChild);
    }

    //it creates a bootstrap card to display the rating
    //https://getbootstrap.com/docs/5.0/components/card/
    ratingsRef.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();

            if (childData.gym == gym) {

                ratingsdiv = document.getElementById('ratings')

                var input = document.createElement('div');
                input.classList.add("card");
                var input2 = document.createElement('div');
                input2.classList.add("card-body");

                h5 = document.createElement('h5');
                h5.classList.add("card-title");
                h5.innerHTML += childData.name;

                input2.appendChild(h5);

                p = document.createElement('p');
                p.classList.add("card-text");
                p.innerHTML += childData.comment;

                input2.appendChild(p);

                //adds the stars to the cards
                for (x = 0; x <= childData.rating; x++) {
                    i = document.createElement('i');
                    i.classList.add("fas");
                    i.classList.add("fa-star");
                    i.classList.add("rating__star");

                    input2.appendChild(i);
                }

                input.appendChild(input2);
                ratingsdiv.appendChild(input);
            }

        });
    });
}