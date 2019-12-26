let Pozivi = (function() {
	function ucitajSaServeraImpl() {
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function () {
			if (ajax.readyState == 4 && ajax.status == 200) {
				var podaci = JSON.parse(ajax.responseText);
				Kalendar.ucitajPodatke(podaci.periodicna, podaci.vanredna);
			}
		}
		ajax.open("GET", "http://localhost:8080/ucitaj", true);
		ajax.send();
	}

	function upisiPeriodicnuImpl(dan, semestar, pocetak, kraj, naziv, predavac, datumS) {
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function () {
			obradiOdgovor(ajax);
		}
		ajax.open("POST", "http://localhost:8080/periodicna", true);
		ajax.setRequestHeader("Content-Type", "application/json");
		ajax.send(JSON.stringify({dan:Number(dan), semestar:semestar, pocetak:pocetak, kraj:kraj, naziv:naziv, predavac:predavac, datumS:datumS}));
	}

	function upisiVanrednuImpl(datum, pocetak, kraj, naziv, predavac, datumS) {
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function () {
			obradiOdgovor(ajax);
		}
		ajax.open("POST", "http://localhost:8080/vanredna", true);
		ajax.setRequestHeader("Content-Type", "application/json");
		ajax.send(JSON.stringify({datum:datum, pocetak:pocetak, kraj:kraj, naziv:naziv, predavac:predavac, datumS:datumS}));
	}

	function obradiOdgovor(ajax) {
		if (ajax.readyState == 4 && ajax.status == 200) {
			var podaci = JSON.parse(ajax.responseText);
			Kalendar.ucitajPodatke(podaci.periodicna, podaci.vanredna);
			azurirajPrikaz(document.getElementById("kalendarRef"));
		} else if (ajax.readyState == 4 && ajax.status == 409) {
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

	return {
		ucitajSaServera: ucitajSaServeraImpl,
		upisiPeriodicnu: upisiPeriodicnuImpl,
		upisiVanrednu: upisiVanrednuImpl,
		ucitajSlike: ucitajSlikeImpl 
	}
}());