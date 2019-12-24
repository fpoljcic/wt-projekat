var trenutniMjesec = new Date().getMonth();

window.onload = function() {
	Kalendar.iscrtajKalendar(document.getElementById("kalendarRef"), trenutniMjesec);
	Pozivi.ucitajSaServera();
	azurirajPrikaz(document.getElementById("kalendarRef"));
}


function sljedeciMjesec(kalendarRef) {
	Kalendar.iscrtajKalendar(kalendarRef, ++trenutniMjesec);
	azurirajPrikaz(kalendarRef);
}

function prethodniMjesec(kalendarRef) {
	Kalendar.iscrtajKalendar(kalendarRef, --trenutniMjesec);
	azurirajPrikaz(kalendarRef);
}

function azurirajPrikaz(kalendarRef) {
	var sala = document.getElementsByName("sale")[0].value;
	// postaviPrikazPeriodicnih(document.getElementsByName("periodicna")[0].checked);
	var pocetak = document.getElementsByName("pocetak")[0].value;
	var kraj = document.getElementsByName("kraj")[0].value;
	Kalendar.obojiZauzeca(kalendarRef, trenutniMjesec, sala, pocetak, kraj);
}