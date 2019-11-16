var trenutniMjesec = new Date().getMonth();

let Kalendar = (function() {
	const mjesecIme = ["Januar", "Februar", "Mart", "April", "Maj", "Juni", "Juli", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"];

	function vratiPrviDanMjeseca(godina, mjesec) {
		return (new Date(godina, mjesec, 1).getDay() || 7) - 1;
	}

	function vratiBrojDanaUMjesecu(godina, mjesec) {
		return new Date(godina, mjesec + 1, 0).getDate();
	}

	function obojiZauzecaImpl(kalendarRef, mjesec, sala, pocetak, kraj) {
		//implementacija ide ovdje
	}

	function ucitajPodatkeImpl(periodicna, redovna){
		//implementacija ide ovdje
	}

	function iscrtajKalendarImpl(kalendarRef, mjesec){
		kalendarRef.rows[0].cells[0].innerHTML = mjesecIme[mjesec];
		var prviDan = vratiPrviDanMjeseca(new Date().getFullYear(), mjesec);
		var brojDana = vratiBrojDanaUMjesecu(new Date().getFullYear(), mjesec);
		var brojac = 1;

		if (prviDan === 6 && brojDana >= 30 || prviDan === 5 && brojDana === 31) 
			document.getElementById("dodatniRed").style.display = "contents ";
		else
			document.getElementById("dodatniRed").style.display = "none";

		for (var i = 2; i < kalendarRef.rows.length; i++) {
			for(var j = 0; j < kalendarRef.rows[i].cells.length; j++) {
				if (i === 2 && j < prviDan || brojac > brojDana)
					kalendarRef.rows[i].cells[j].style.visibility = "hidden";
				else {
					kalendarRef.rows[i].cells[j].style.visibility = "visible";
					kalendarRef.rows[i].cells[j].innerHTML = brojac++;
				}
			}
		}
		zabraniDugmad(mjesec);
	}

	function zabraniDugmad(mjesec) {
		document.getElementsByName("prethodni")[0].disabled = mjesec === 0;
		document.getElementsByName("sljedeci")[0].disabled = mjesec === 11;
	}

	return {
		obojiZauzeca: obojiZauzecaImpl,
		ucitajPodatke: ucitajPodatkeImpl,
		iscrtajKalendar: iscrtajKalendarImpl
	}
}());

window.onload = Kalendar.iscrtajKalendar(document.getElementById('kalendarRef'), trenutniMjesec);

function sljedeciMjesec(kalendarRef) {
	Kalendar.iscrtajKalendar(kalendarRef, ++trenutniMjesec);
}

function prethodniMjesec(kalendarRef) {
	Kalendar.iscrtajKalendar(kalendarRef, --trenutniMjesec);
}

//primjer korištenja modula
//Kalendar.obojiZauzeca(document.getElementById("kalendar"),1,"1-15","12:00","13:30");