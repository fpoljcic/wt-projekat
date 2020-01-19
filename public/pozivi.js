let Pozivi = (function() {
	function ucitajSaServeraImpl() {
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function () {
			if (ajax.readyState == 4 && ajax.status == 200) {
				var podaci = JSON.parse(ajax.responseText);
				Kalendar.ucitajPodatke(podaci.periodicna, podaci.vanredna);
				azurirajPrikaz(document.getElementById("kalendarRef"));
			}
		}
		ajax.open("GET", "http://localhost:8080/rezervacije", true);
		// Potrebno da bi sklonili XML Parsing error grešku na Firefox-u
		ajax.overrideMimeType("text/html");
		ajax.send();
	}

	function upisiPeriodicnuImpl(dan, semestar, pocetak, kraj, naziv, predavac, datumS) {
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function () {
			obradiOdgovor(ajax);
		}
		ajax.open("POST", "http://localhost:8080/periodicna", true);
		ajax.setRequestHeader("Content-Type", "application/json");
		// Potrebno da bi sklonili XML Parsing error grešku na Firefox-u
		ajax.overrideMimeType("text/html");
		ajax.send(JSON.stringify({dan:Number(dan), semestar:semestar, pocetak:pocetak, kraj:kraj, naziv:naziv, predavac:predavac, datumS:datumS}));
	}

	function upisiVanrednuImpl(datum, pocetak, kraj, naziv, predavac) {
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function () {
			obradiOdgovor(ajax);
		}
		ajax.open("POST", "http://localhost:8080/vanredna", true);
		ajax.setRequestHeader("Content-Type", "application/json");
		// Potrebno da bi sklonili XML Parsing error grešku na Firefox-u
		ajax.overrideMimeType("text/html");
		ajax.send(JSON.stringify({datum:datum, pocetak:pocetak, kraj:kraj, naziv:naziv, predavac:predavac}));
	}

	function obradiOdgovor(ajax) {
		if (ajax.readyState == 4 && ajax.status == 200) {
			var podaci = JSON.parse(ajax.responseText);
			Kalendar.ucitajPodatke(podaci.periodicna, podaci.vanredna);
			azurirajPrikaz(document.getElementById("kalendarRef"));
		} else if (ajax.readyState == 4 && ajax.status == 409) {
			Pozivi.ucitajSaServera();
			var greska = ajax.responseText;
			alert(greska);
		} else if (ajax.readyState == 4 && ajax.status == 400) {
			var greska = ajax.responseText;
			alert(greska);
		}
	}

	function ucitajSlikeImpl(indexStranice) {
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function () {
			if (ajax.readyState == 4 && ajax.status == 200) {
				var podaci = JSON.parse(ajax.responseText);
				prikaziSlike(podaci.images, false);
			}
		}
		ajax.open("GET", "http://localhost:8080/slike?indexStranice=" + indexStranice, true);
		ajax.send();
		console.log("Poslan ajax zahtjev za slike");
	}

	function postojiSlikaImpl(id) {
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function () {
			if (ajax.readyState == 4 && ajax.status == 200) {
				setUcitaneSve(!JSON.parse(ajax.responseText).result);
				zabraniDugmad();
			}
		}
		ajax.open("GET", "http://localhost:8080/postojiSlika?id=" + id, true);
		ajax.send();
	}

	function ucitajOsobljeImpl() {
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function () {
			if (ajax.readyState == 4 && ajax.status == 200) {
				var osoblje = JSON.parse(ajax.responseText);
				upisiOsoblje(osoblje);
			}
		}
		ajax.open("GET", "http://localhost:8080/osoblje", true);
		// Potrebno da bi sklonili XML Parsing error grešku na Firefox-u
		ajax.overrideMimeType("text/html");
		ajax.send();
	}

	function ucitajSaleImpl() {
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function () {
			if (ajax.readyState == 4 && ajax.status == 200) {
				var sale = JSON.parse(ajax.responseText);
				upisiSale(sale);
			}
		}
		ajax.open("GET", "http://localhost:8080/sale", true);
		// Potrebno da bi sklonili XML Parsing error grešku na Firefox-u
		ajax.overrideMimeType("text/html");
		ajax.send();
	}

	return {
		ucitajSaServera: ucitajSaServeraImpl,
		upisiPeriodicnu: upisiPeriodicnuImpl,
		upisiVanrednu: upisiVanrednuImpl,
		ucitajSlike: ucitajSlikeImpl,
		postojiSlika: postojiSlikaImpl,
		ucitajOsoblje: ucitajOsobljeImpl,
		ucitajSale: ucitajSaleImpl
	}
}());