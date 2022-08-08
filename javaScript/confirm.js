var db = firebase.database();
var dbGyms = db.ref('gyms');

const auth = firebase.auth();

const user = auth.currentUser;
var userSession = null;

//this is to bring the gym info to confirm page
function displayGym()
{
	let data = sessionStorage.getItem('selectedGym');
	document.getElementById("gyminfo").innerHTML = data;
	document.getElementById("gyminfo").innerHTML += ' - Capacity: ' + sessionStorage.getItem('capacity');
}
displayGym();

auth.onAuthStateChanged((user) => {
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/firebase.User
		userSession = user;
	}
	else {
		// TODOUser is signed out
	}
});

//to prevent buying before
function validateDate(date) {
	//console.log(date);
	if (date == null || date == "") {
		alert('Please fill in the date');
		return false;
	}
	var parsedDate = new Date(date);
	var today = new Date();

	parsedDate.setHours(0,0,0,0);

	today.setHours(0,0,0,0);

	if (parsedDate < today) {

		alert('Date must be today onwards');
		return false;
	}

	return true;
}

Date.prototype.addDays = function (days) {
	let date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
  }

function getCalculatedExpiredDate(date, quantity)
{
	var parsedDate = new Date(date);
	return parsedDate.addDays(Number(quantity));
}

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

				if(userSession != null)
				{
					firebase.database().ref('users/' + userSession.uid).set({
						username: userSession.uid,
						email: userSession.email,
						gym: g
					});
				}

			}
		});
	});
}

// create purchase
async function createPurchase(transaction) {

	var db = firebase.database();
	var dbPurchases = db.ref('purchases');
	var gym = sessionStorage.getItem('selectedGym');
	var quantity = document.getElementById("quantity").value;
	var date = new Date(document.getElementById("date").value);
	var parsedDate = new Date(date);
	var purchaseInfo = dbPurchases.push();
	var dateNow = new Date();

	var test = await purchaseInfo.set({
		status: transaction.status,
		id: transaction.id,
		user: userSession == null ? "" : userSession.uid,
		gym: gym,
		quantity: quantity,
		purchasedate: dateNow.toDateString(),
		date: parsedDate.toDateString(),
		expiredate: getCalculatedExpiredDate(date, quantity).toDateString()
	});

	var aaa = test;
}

function generateQrCode(transaction){

	// todo: store url in environment variable
	var url = "file:///C:/Users/joaoe/code/1GymApp/pass-validator.html?transaction_id=" + transaction.uid;
	var qrc = new QRCode(document.getElementById("qrcode"), url);

}

paypal.Buttons({
	// Sets up the transaction when a payment button is clicked
	createOrder: (data, actions) => {
		return actions.order.create({
			purchase_units: [{
				amount: {
					value: document.getElementById("price").value
				}
			}]
		});
	},

	onInit: function(data, actions)
	{
		//disable the buttons
		actions.disable();

		var date = document.getElementById("date").value;
		//listen for changes to the checkbox
		document.getElementById("date").addEventListener('change', function(event)
		{
			//Enable or disable the button when it is checked or unchecked
			if(validateDate(this.value))
			{
				actions.enable();
				console.log(date);
				console.log(quantity);
			}
			else
			{
				actions.disable();
			}
		});
	},

	onClick: (e) => {
		
	},

	// Finalize the transaction after payer approval
	onApprove: (data, actions) => {
		return actions.order.capture().then(function (orderData) {
			// Successful capture! For dev/demo purposes:
			console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
			const transaction = orderData.purchase_units[0].payments.captures[0];
			//console.log(transaction);
			alert(`Transaction ${transaction.status}: ${transaction.id}\n\nThank you for your payment`);
			// When ready to go live, remove the alert and show a success message within this page. For example:
			// const element = document.getElementById('paypal-button-container');
			// element.innerHTML = '<h3>Thank you for your payment!</h3>';
			// Or go to another URL:  actions.redirect('thank_you.html');
			linkUserToGym();
			createPurchase(transaction);
			generateQrCode(transaction);
			subtractCapacity();

		});
	}
}).render('#paypal-button-container');

function subtractCapacity()
{
	var gym = sessionStorage.getItem('selectedGym');
	var capacity = document.getElementById("quantity").value;
	var usersRef = firebase.database().ref('gyms/');
	//use "once" otherwise it goes into infinite loop when changing values inside the loop
	//https://stackoverflow.com/questions/66895722/javascript-infinite-loop-when-updating-firebase-realtime-database

	usersRef.once("value", function(snapshot)
	{
		snapshot.forEach(function (childSnapshot)
		{
			var childData = childSnapshot.val();

			if(gym == childData.name)
			{
				var data = {
					name: childData.name,
					latitude: childData.latitude,
					longitude: childData.longitude,
					capacity: parseInt(childData.capacity) - parseInt(capacity)
				}

				var key = childSnapshot.key;
				var updates = {}
				updates['gyms/' + key] = data;
				firebase.database().ref().update(updates);
				sessionStorage.setItem('capacity', parseInt(childData.capacity) - parseInt(capacity));
				displayGym();
				return;
			}
		})
	})
}
