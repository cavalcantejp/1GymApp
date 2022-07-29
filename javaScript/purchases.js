const auth = firebase.auth();

const user = auth.currentUser;

auth.onAuthStateChanged((user) => {
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/firebase.User
		var uid = user.uid;
        document.getElementById('myuser').innerHTML = "Logged in as: " + user.email + " ";

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
                    p.innerHTML = childData.gym + ": " + childData.quantity + " passes on " + childData.date;

                    purchases.appendChild(p);
                    console.log("test");
                }
            });
        });
	}
	else 
    {
		// TODOUser is signed out
	}
});