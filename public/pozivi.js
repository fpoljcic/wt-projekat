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
		ajax.send();
	}

	function upisiPeriodicnuImpl(dan, semestar, pocetak, kraj, naziv, predavac, datumS) {
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function () {
			if (ajax.readyState == 4) {
				if (ajax.status == 428) {
					var potvrda = ajax.responseText;
					if (confirm(potvrda)) {
						ajax.open("POST", "http://localhost:8080/periodicna", true);
						ajax.setRequestHeader("Content-Type", "application/json");
						ajax.send(JSON.stringify({dan:Number(dan), semestar:semestar, pocetak:pocetak, kraj:kraj, naziv:naziv, predavac:predavac, datumS:datumS, potvrda: true}));
					}
				} else
					obradiOdgovor(ajax);
			}
		}
		ajax.open("POST", "http://localhost:8080/periodicna", true);
		ajax.setRequestHeader("Content-Type", "application/json");
		ajax.send(JSON.stringify({dan:Number(dan), semestar:semestar, pocetak:pocetak, kraj:kraj, naziv:naziv, predavac:predavac, datumS:datumS}));
	}

	function upisiVanrednuImpl(datum, pocetak, kraj, naziv, predavac) {
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function () {
			if (ajax.readyState == 4) {
				if (ajax.status == 428) {
					var potvrda = ajax.responseText;
					if (confirm(potvrda)) {
						ajax.open("POST", "http://localhost:8080/vanredna", true);
						ajax.setRequestHeader("Content-Type", "application/json");
						ajax.send(JSON.stringify({datum:datum, pocetak:pocetak, kraj:kraj, naziv:naziv, predavac:predavac, potvrda: true}));
					}
				} else
					obradiOdgovor(ajax);
			}
		}
		ajax.open("POST", "http://localhost:8080/vanredna", true);
		ajax.setRequestHeader("Content-Type", "application/json");
		ajax.send(JSON.stringify({datum:datum, pocetak:pocetak, kraj:kraj, naziv:naziv, predavac:predavac}));
	}

	function obradiOdgovor(ajax) {
		switch (ajax.status) {
			case 200:
				var podaci = JSON.parse(ajax.responseText);
				Kalendar.ucitajPodatke(podaci.periodicna, podaci.vanredna);
				azurirajPrikaz(document.getElementById("kalendarRef"));
				break;
			case 409:
				Pozivi.ucitajSaServera();
				var greska = ajax.responseText;
				alert(greska);
				break;
			case 400:
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
		ajax.send();
	}

	function ucitajSaleOsobljaImpl() {
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function () {
			if (ajax.readyState == 4 && ajax.status == 200) {
				var osoblje = JSON.parse(ajax.responseText);
				upisiSaleOsoblje(osoblje);
			}
		}
		ajax.open("GET", "http://localhost:8080/saleOsoblja", true);
		ajax.send();
		console.log("Poslan ajax zahtjev za azuriranje sala");
	}

	function vratiOsobuZaRezImpl(datum, naziv, pocetak, kraj) {
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function () {
			if (ajax.readyState == 4 && ajax.status == 200) {
				var objekat = JSON.parse(ajax.responseText);
				ispisiAlert(objekat.osoba, objekat.naziv, objekat.datum, objekat.pocetak, objekat.kraj);
			}
		}
		ajax.open("POST", "http://localhost:8080/vratiOsobuZaRez", true);
		ajax.setRequestHeader("Content-Type", "application/json");
		ajax.send(JSON.stringify({datum:datum, naziv:naziv, pocetak:pocetak, kraj:kraj}));
	}

	return {
		ucitajSaServera: ucitajSaServeraImpl,
		upisiPeriodicnu: upisiPeriodicnuImpl,
		upisiVanrednu: upisiVanrednuImpl,
		ucitajSlike: ucitajSlikeImpl,
		postojiSlika: postojiSlikaImpl,
		ucitajOsoblje: ucitajOsobljeImpl,
		ucitajSale: ucitajSaleImpl,
		ucitajSaleOsoblja: ucitajSaleOsobljaImpl,
		vratiOsobuZaRez: vratiOsobuZaRezImpl
	}
}());