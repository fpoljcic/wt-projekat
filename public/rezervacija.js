var trenutniMjesec = new Date().getMonth();

window.onload = function() {
	Kalendar.iscrtajKalendar(document.getElementById("kalendarRef"), trenutniMjesec);
	Pozivi.ucitajSaServera();
	Pozivi.ucitajOsoblje();
	Pozivi.ucitajSale();
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
	var pocetak = document.getElementsByName("pocetak")[0].value;
	var kraj = document.getElementsByName("kraj")[0].value;
	Kalendar.obojiZauzeca(kalendarRef, trenutniMjesec, sala, pocetak, kraj);
}

function rezervisi(element) {
	var pocetak = document.getElementsByName("pocetak")[0].value;
	var kraj = document.getElementsByName("kraj")[0].value;

	if (pocetak == "") {
		window.alert("Odaberite početno vrijeme zauzeća");
		return;
	}

	if (kraj == "") {
		window.alert("Odaberite krajnje vrijeme zauzeća");
		return;
	}

	if (pocetak > kraj) {
		window.alert("Pogrešno unesena vremena zauzeća");
		return;
	}

	var naziv = document.getElementsByName("sale")[0].value;
	var dan = element.innerHTML.toString().padStart(2, "0");
	var mjesecNaziv = document.getElementsByTagName("th")[0].innerHTML;
	var mjesec;
	const mjesecIme = ["Januar", "Februar", "Mart", "April", "Maj", "Juni", "Juli", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"];
	for (var i = 0; i < 12; i++) {
		if (mjesecIme[i] == mjesecNaziv) {
			mjesec = i + 1;
			break;
		}
	}
	mjesec = mjesec.toString().padStart(2, "0");
	var godina = new Date().getFullYear();
	var datum = dan + "/" + mjesec + "/" + godina;
	var periodicna = document.getElementsByName("periodicna")[0].checked;

	if (element.className != "slobodna") {
		alert("Nije moguće rezervisati salu " + naziv + " za navedeni datum " + datum + " i termin od " + pocetak + " do " + kraj + "!");
		return;
	}
	
	var predavacID = document.getElementsByName("osoblje")[0].value;
	
	// Slobodna sala za dato vrijeme
	if (confirm("Da li želite da rezervišete ovaj termin?")) {
		if (periodicna) {
			var semestar;
			if (mjesec >= 2 && mjesec <= 6)
				semestar = "ljetni";
			else if (mjesec >= 10 && mjesec <= 12 || mjesec == 1)
				semestar = "zimski";
			else {
				alert("Periodicna rezervacija nije moguća za dati mjesec");
				return;
			}
			dan = element.cellIndex;
			Pozivi.upisiPeriodicnu(dan, semestar, pocetak, kraj, naziv, predavacID, datum);
		} else
		Pozivi.upisiVanrednu(datum.split("/").join("."), pocetak, kraj, naziv, predavacID);
	}
}

function upisiOsoblje(osoblje) {
	var osobljeSelect = document.getElementsByName("osoblje")[0];
	for(var i in osoblje) {
		osobljeSelect.add(new Option(osoblje[i].ime + " " + osoblje[i].prezime, osoblje[i].id));
	}
}

function upisiSale(sale) {
	var saleSelect = document.getElementsByName("sale")[0];
	for(var i in sale) {
		saleSelect.add(new Option(sale[i].naziv, sale[i].naziv));
	}
}