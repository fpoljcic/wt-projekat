window.onload = function() {
	Pozivi.ucitajSlike();
}

function prikaziSlike(putanja) {
	document.getElementsByClassName("sadrzaj")[0].innerHTML = "<img src='" + putanja + "' alt='1'>";
}