var putanjeSlika = [];
var indexStranice = 0;
var maxIndexStranice = 0;

window.onload = function() {
	Pozivi.ucitajSlike(indexStranice);
}

function prikaziSlike(putanje, vecUcitane) {
	var slika1 = "<img src='" + putanje[0] + "' alt='" + putanje[0].substring(putanje[0].lastIndexOf("/") + 1, putanje[0].lastIndexOf(".")) + "'>";
	var slika2 = "";
	var slika3 = "";
	if (indexStranice < 3) {
		slika2 = "<img src='" + putanje[1] + "' alt='" + putanje[1].substring(putanje[1].lastIndexOf("/") + 1, putanje[1].lastIndexOf(".")) + "'>";
		slika3 = "<img src='" + putanje[2] + "' alt='" + putanje[2].substring(putanje[2].lastIndexOf("/") + 1, putanje[2].lastIndexOf(".")) + "'>";
	}
	var slike = slika1 + slika2 + slika3;
	if (!vecUcitane)
		putanjeSlika.push(putanje);
	document.getElementsByClassName("sadrzaj")[0].innerHTML = slike;
}

function prethodni() {
	indexStranice--;
	prikaziSlike(putanjeSlika[indexStranice], true);
	zabraniDugmad();
}

function zabraniDugmad() {
	document.getElementsByName("prethodni")[0].disabled = indexStranice === 0;
	document.getElementsByName("sljedeci")[0].disabled = indexStranice === 3;
}

function sljedeci() {
	indexStranice++;
	if (indexStranice > maxIndexStranice) {
		maxIndexStranice = indexStranice;
		Pozivi.ucitajSlike(indexStranice);
	} else prikaziSlike(putanjeSlika[indexStranice], true);
	zabraniDugmad();
}