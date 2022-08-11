const auth = firebase.auth();

const user = auth.currentUser;

auth.onAuthStateChanged((user) => {
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/firebase.User
		//var uid = user.uid;
        //document.getElementById('myuser').innerHTML = "Logged in as: " + user.email + " ";

        var purchases = document.getElementById("purchases");

        var usersRef = firebase.database().ref('purchases/');

        usersRef.once("value", function(snapshot)
        {
            snapshot.forEach(function(childSnapshot)
            {
                var childData = childSnapshot.val();
                if(user.uid == childData.user)
                {
                    var p = document.createElement('p');
                    p.innerHTML = "Pass Number: " + childData.id + " Gym: " + childData.gym + " Qty: " + childData.quantity + "User id: " + childData.user;
                    purchases.appendChild(p);
                }
            });

            if (purchases.innerHTML == ""){
                purchases.innerHTML = "No purchases to display.";
            }
        });
	}
	else 
    {
		location.href = "index.html";
	}
});