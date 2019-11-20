var trenutniMjesec = new Date().getMonth();
var prikazPeriodicnih = false;

let Kalendar = (function() {
	const mjesecIme = ["Januar", "Februar", "Mart", "April", "Maj", "Juni", "Juli", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"];
	var periodicna, vanredna;

	function vratiBroj(regex, broj) {
		regex.lastIndex = 0;
		var izdvojen = regex.exec(broj);
		var s = izdvojen[1].charAt(1);
		if (izdvojen[1].charAt(0) === '0')
			return (parseInt(izdvojen[1].charAt(1)) - 1);
		return (parseInt(izdvojen[1]) - 1);
	}

	function vratiMjesecIzDatuma(datum) {
		var regex = /\.(\d\d)\./gm;
		return vratiBroj(regex, datum);
	}

	function vratiDanIzDatuma(datum) {
		var regex = /(\d\d)\./gm;
		return vratiBroj(regex, datum);
	}

	function vratiGodinuIzDatuma(datum) {
		var regex = /\.(\d\d\d\d)/gm;
		return (vratiBroj(regex, datum) + 1);
	}

	function vratiPrviDanMjeseca(godina, mjesec) {
		return (new Date(godina, mjesec, 1).getDay() || 7) - 1;
	}

	function vratiBrojDanaUMjesecu(godina, mjesec) {
		return new Date(godina, mjesec + 1, 0).getDate();
	}

	function obojiSveZeleno(kalendarRef) {
		for (var i = 2; i < kalendarRef.rows.length; i++) {
			for(var j = 0; j < kalendarRef.rows[i].cells.length; j++) {
				kalendarRef.rows[i].cells[j].className = "slobodna";
			}
		}
	}

	function vratiNizMjeseciSemestra(semestar) {
		if (semestar === "ljetni")
			return [1, 2, 3, 4, 5];
		if (semestar === "zimski")
			return [9, 10, 11, 0];
		return false;
	}

	function nalaziSeUIntervalu(pocetak1, kraj1, pocetak2, kraj2) {
		var regexSati = /(\d\d):/gm;
		var regexMinute = /:(\d\d)/gm;

		var x1 = vratiBroj(regexSati, pocetak1) + 1;
		var x2 = vratiBroj(regexSati, kraj1) + 1;
		var y1 = vratiBroj(regexSati, pocetak2) + 1;
		var y2 = vratiBroj(regexSati, kraj2) + 1;

		var x1m = vratiBroj(regexMinute, pocetak1) + 1;
		var x2m = vratiBroj(regexMinute, kraj1) + 1;
		var	y1m = vratiBroj(regexMinute, pocetak2) + 1;
		var	y2m = vratiBroj(regexMinute, kraj2) + 1;

		if (x1 > x2 || y1 > y2 || x1 == x2 && x1m > x2m || y1 == y2 && y1m > y2m)
			return false;
		else if (x1 == x2 && y1 != y2 && x1 >= y1 && x1 < y2)
			return true;
		else if (y1 == y2 && x1 != x2 && y1 >= x1 && y1 < x2)
			return true;
		else if (x1 < y2 && y1 < x2)
			return true;
		else if (x1 != x2 || y1 != y2)
			return false;
		else if (x1m == x2m && y1m != y2m && x1m >= y1m && x1m < y2m)
			return true;
		else if (y1m == y2m && x1m != x2m && y1m >= x1m && y1m < x2m)
			return true;
		return x1m < y2m && y1m < x2m;
	}

	function obojiZauzecaImpl(kalendarRef, mjesec, sala, pocetak, kraj) {
		if (periodicna === undefined || vanredna === undefined)
			return false;
		obojiSveZeleno(kalendarRef);
		var prviDan = vratiPrviDanMjeseca(new Date().getFullYear(), mjesec);
		if (pocetak == "")
			pocetak = "00:00";
		if (kraj == "")
			kraj = "23:59";

		if (prikazPeriodicnih) {
			for (var periodicnoZauzece of periodicna) {
				if (periodicnoZauzece.naziv === sala && nalaziSeUIntervalu(periodicnoZauzece.pocetak, periodicnoZauzece.kraj, pocetak, kraj) && vratiNizMjeseciSemestra(periodicnoZauzece.semestar).includes(mjesec)) {
					var dan = periodicnoZauzece.dan;
					for (var i = 2; i < kalendarRef.rows.length; i++) {
						kalendarRef.rows[i].cells[dan].className = "zauzeta";
					}
				}
			}
		} else {
			for (var vanrednoZauzece of vanredna) {
				if (vanrednoZauzece.naziv === sala && nalaziSeUIntervalu(vanrednoZauzece.pocetak, vanrednoZauzece.kraj, pocetak, kraj) && vratiMjesecIzDatuma(vanrednoZauzece.datum) === mjesec && vratiGodinuIzDatuma(vanrednoZauzece.datum) === new Date().getFullYear()) {
					var dan = vratiDanIzDatuma(vanrednoZauzece.datum);
					var x = Math.floor((dan + prviDan) / 7);
					var y = (prviDan + (dan % 7)) % 7;
					kalendarRef.rows[x + 2].cells[y].className = "zauzeta";
				}
			}
		}
	}

	function ucitajPodatkeImpl(periodicnaP, vanrednaP){
		periodicna = periodicnaP;
		vanredna = vanrednaP;
	}

	function iscrtajKalendarImpl(kalendarRef, mjesec){
		kalendarRef.rows[0].cells[0].innerHTML = mjesecIme[mjesec];
		var prviDan = vratiPrviDanMjeseca(new Date().getFullYear(), mjesec);
		var brojDana = vratiBrojDanaUMjesecu(new Date().getFullYear(), mjesec);
		var brojac = 1;

		if (prviDan === 6 && brojDana >= 30 || prviDan === 5 && brojDana === 31) 
			document.getElementById("dodatniRed").style.display = "contents";
		else
			document.getElementById("dodatniRed").style.display = "none";

		for (var i = 2; i < kalendarRef.rows.length; i++) {
			for (var j = 0; j < kalendarRef.rows[i].cells.length; j++) {
				if (i === 2 && j < prviDan || brojac > brojDana) {
					kalendarRef.rows[i].cells[j].style.visibility = "hidden";
					kalendarRef.rows[i].cells[j].innerHTML = "";
				}
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


window.onload = function(){
	Kalendar.iscrtajKalendar(document.getElementById("kalendarRef"), trenutniMjesec);

	var periodicna = [{dan: 0, semestar: "zimski", pocetak: "09:00", kraj: "11:00", naziv: "0-01", predavac: "Vedran"},
	{dan: 1, semestar: "ljetni", pocetak: "09:00", kraj: "11:00", naziv: "0-02", predavac: "Emir"},
	{dan: 2, semestar: "zimski", pocetak: "09:00", kraj: "11:00", naziv: "0-01", predavac: "Juric"},
	{dan: 3, semestar: "zimski", pocetak: "10:00", kraj: "12:00", naziv: "0-02", predavac: "Dzenana"},
	{dan: 4, semestar: "zimski", pocetak: "10:00", kraj: "12:00", naziv: "0-01", predavac: "Vedran"},
	{dan: 5, semestar: "ljetni", pocetak: "12:00", kraj: "14:00", naziv: "0-02", predavac: "Juric"},
	{dan: 6, semestar: "ljetni", pocetak: "09:00", kraj: "11:00", naziv: "0-01", predavac: "Zenan"}];

	var vanredna = [{datum: "17.11.2019", pocetak: "09:00", kraj: "11:00", naziv: "0-01", predavac: "Faris"},
	{datum: "18.11.2019", pocetak: "09:00", kraj: "11:00", naziv: "0-01", predavac: "Armin"},
	{datum: "29.11.2019", pocetak: "09:00", kraj: "11:00", naziv: "0-01", predavac: "Adin"},
	{datum: "01.12.2019", pocetak: "10:00", kraj: "12:00", naziv: "0-02", predavac: "Anes"},
	{datum: "01.01.2019", pocetak: "09:00", kraj: "11:00", naziv: "0-02", predavac: "Faris"},
	{datum: "28.02.2019", pocetak: "09:00", kraj: "11:00", naziv: "0-02", predavac: "Amra"},
	{datum: "31.12.2019", pocetak: "10:00", kraj: "12:00", naziv: "0-02", predavac: "Sile"}];

	Kalendar.ucitajPodatke(periodicna, vanredna);
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
	postaviPrikazPeriodicnih(document.getElementsByName("periodicna")[0].checked);
	var pocetak = document.getElementsByName("pocetak")[0].value;
	var kraj = document.getElementsByName("kraj")[0].value;
	Kalendar.obojiZauzeca(kalendarRef, trenutniMjesec, sala, pocetak, kraj);
}

function postaviPrikazPeriodicnih(prikaz) {
	prikazPeriodicnih = prikaz;
}