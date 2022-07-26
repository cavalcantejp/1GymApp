var db = firebase.database();
var dbGyms = db.ref('gyms');

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

//to prevent buying before
function validateDate(date) {
	if (date == "" || date == null) {
		alert('Please fill in the date');
		return false;
	}
	var parsedDate = new Date(date);
	var today = new Date();

	if (parsedDate < today) {
		alert('Date must be today onwards');
		return false;
	}

	return true;
}

//this is to bring the gym info to confirm page
let data = sessionStorage.getItem('selectedGym');
document.getElementById("gyminfo").innerHTML = data;
document.getElementById("gyminfo").innerHTML += 'Capacity' + sessionStorage.getItem('capacity');

document.getElementById("price").value = (12 * 1);
document.getElementById("quantity").addEventListener("click", function (e) {
	document.getElementById("price").value = (12 * document.getElementById("quantity").value);
})

//linking user to the gym 
function linkUserToGym() {
	dbGyms.on("value", function (snapshot) {

		snapshot.forEach(function (childSnapshot) {
			var childData = childSnapshot.val();

			if (sessionStorage.getItem('selectedGym') == childData.name) {
				var g = sessionStorage.getItem('selectedGym');

				firebase.database().ref('users/' + uid.uid).set({
					username: uid.uid,
					email: uid.email,
					gym: g
				});

			}
		});
	});
}
