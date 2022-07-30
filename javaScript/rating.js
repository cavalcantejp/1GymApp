//this is our array of stars
const ratingStars = [...document.getElementsByClassName("rating__star")];

//Reference
//https://dev.to/leonardoschmittk/how-to-make-a-star-rating-with-js-36d3

var rating = 0;
var gymname = "";

//pass the array as an argument
function executeRating(stars) {
    //active = stars filled
    const starClassActive = "rating__star fas fa-star";
    const starClassInactive = "rating__star far fa-star";
    //declare those outide so the loop does not check every time
    const starsLength = stars.length;
    let i;

    //for each star in the array the function maps the star which was clicked
    stars.map((star) => {
        star.onclick = () => {
            i = stars.indexOf(star);
            rating = i;
            //check if the star is empty
            if (star.className === starClassInactive) {
                for (i; i >= 0; --i) stars[i].className = starClassActive;
            } else {
                //in this case all stars above the one click will be empty
                for (i; i < starsLength; ++i) stars[i].className = starClassInactive;
            }
        };
    });
}
executeRating(ratingStars);

const auth = firebase.auth();

const user = auth.currentUser;

auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        document.getElementById('myuser').innerHTML = "Logged in as: " + user.email + " ";

        var usersRef = firebase.database().ref('users/');

        usersRef.on("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();

                //document.getElementById('gymname').innerHTML = "Gym: " + childData.gym;
                gymname = childData.gym;
            });
        });

        var purchases = firebase.database().ref('purchases/');

        var dropgym = document.getElementById("drop-gym");
        purchases.once("value", function(snapshot) 
        {
            snapshot.forEach(function (childSnapshot)
            {
                //loop to stop appearing multiple of the same gym
                var childData = childSnapshot.val();
                for(var i = 0; i<dropgym.options.length; i++)
                {
                    if(dropgym.options[i].value == childData.gym)
                    return;
                }
                if (childData.user == uid)
                {
                    dropgym.options[dropgym.options.length] = new Option(childData.gym, childData.gym);
                }
            });
        });

    } else {
        // User is signed out
        // ...
    }
});


document.getElementById("commentbutton").addEventListener("click", function () {

    var name = document.getElementById('name').value;
    var comment = document.getElementById('comment').value;
    var comment = document.getElementById("drop-gym");


    firebase.database().ref('ratings/' + Date.now()).set({
        gym: dropgym.value,
        name: name,
        comment: comment,
        rating: rating
    });

    alert("Thank you for your submission");
    location.href = "rating.html";

});