function validateDate(date)
{
	if (date == "" || date == null){
		alert('Please fill in the date');
		return false;
	}
	var parsedDate = new Date(date);
	var today = new Date();

	if(parsedDate < today) 
	{
		alert('Date must be today onwards');
		return false;
	}

	return true;
}

let data = sessionStorage.getItem('selectedGym');
document.getElementById("gyminfo").innerHTML = data;
document.getElementById("gyminfo").innerHTML += 'Capacity' + sessionStorage.getItem('capacity');
