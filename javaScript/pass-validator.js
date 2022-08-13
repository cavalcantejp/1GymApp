(function (){
	//import {getDatabase, ref, get, set, child, update, remove}
	//from 'https://www.gstatic.com/firebasejs/8.6.1/firebase-database.js';

	const params = new URLSearchParams(window.location.search);
	const transaction_id = params.get("transaction_id");

	alert(transaction_id);

	var purchasesRef = firebase.database().ref('purchases/'+transaction_id);

	purchasesRef.once('value', function (snapshot) {
		var childData = snapshot.val();
		updatePurchase(transaction_id, childData);
	});

	function updatePurchase(transaction_id, purchase) {
		
		var numberofusedtimes = purchase.numberofusedtimes == null ? 1 : purchase.numberofusedtimes + 1;

		if (Number(purchase.quantity) < numberofusedtimes){
			document.getElementById("message").innerHTML = "Number of times used ("+numberofusedtimes+") exceeded.";
			return;
		}

		purchase.numberofusedtimes = numberofusedtimes;

		var db = firebase.database();
		var dbPurchases = firebase.database().ref('purchases/'+transaction_id);
		dbPurchases.set(purchase);

		document.getElementById("message").innerHTML = "Pass successfully validated.";
	}

})();