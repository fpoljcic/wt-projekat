let Kalendar = (function() {
	const mjesecIme = ["Januar", "Februar", "Mart", "April", "Maj", "Juni", "Juli", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"];
	var periodicna, vanredna;

	function vratiBroj(regex, broj) {
		regex.lastIndex = 0;
		var izdvojen = regex.exec(broj);
		if (izdvojen == null)
			return -1;
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
		return [];
	}

	function nalaziSeUIntervalu(pocetak1, kraj1, pocetak2, kraj2) {
		var rxPatern = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
		if (!(rxPatern.test(pocetak1)) || !(rxPatern.test(kraj1)) || !(rxPatern.test(pocetak2)) || !(rxPatern.test(kraj2)))
			return false;
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

		x1 += x1m / 60;
		x2 += x2m / 60;
		y1 += y1m / 60;
		y2 += y2m / 60;

		if (x1 > x2 || y1 > y2 || x1 == x2 && x1m > x2m || y1 == y2 && y1m > y2m)
			return false;
		else if (x1 == x2 && y1 != y2 && x1 >= y1 && x1 < y2)
			return true;
		else if (y1 == y2 && x1 != x2 && y1 >= x1 && y1 < x2)
			return true;
		else if (x1 < y2 && y1 < x2)
			return true;
		return !(x1 != x2 || y1 != y2);
	}

	function obojiZauzecaImpl(kalendarRef, mjesec, sala, pocetak, kraj) {
		var rxPatern = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
		if (mjesec < 0 || mjesec > 11 || !(rxPatern.test(pocetak)) || !(rxPatern.test(kraj)))
			return false;
		obojiSveZeleno(kalendarRef);
		var prviDan = vratiPrviDanMjeseca(new Date().getFullYear(), mjesec);
		/*
		if (pocetak == "")
			pocetak = "00:00";
		if (kraj == "")
			kraj = "23:59";
		*/
		if (periodicna != undefined && periodicna != null) {
			for (var periodicnoZauzece of periodicna) {
				if (periodicnoZauzece.naziv === sala && nalaziSeUIntervalu(periodicnoZauzece.pocetak, periodicnoZauzece.kraj, pocetak, kraj) && vratiNizMjeseciSemestra(periodicnoZauzece.semestar).includes(mjesec)) {
					var dan = periodicnoZauzece.dan;
					if (dan < 0 || dan > 6)
						continue;
					for (var i = 2; i < kalendarRef.rows.length; i++) {
						kalendarRef.rows[i].cells[dan].className = "zauzeta";
					}
				}
			}
		}
		if (vanredna != undefined && vanredna != null) {
			for (var vanrednoZauzece of vanredna) {
				if (vanrednoZauzece.naziv === sala && nalaziSeUIntervalu(vanrednoZauzece.pocetak, vanrednoZauzece.kraj, pocetak, kraj) && vratiMjesecIzDatuma(vanrednoZauzece.datum) === mjesec && vratiGodinuIzDatuma(vanrednoZauzece.datum) === new Date().getFullYear()) {
					var dan = vratiDanIzDatuma(vanrednoZauzece.datum);
					var brojDana = vratiBrojDanaUMjesecu(new Date().getFullYear(), mjesec);
					if (dan < 0 || dan > brojDana - 1)
						continue;
					var x = Math.floor((dan + prviDan) / 7);
					var y = (prviDan + (dan % 7)) % 7;
					kalendarRef.rows[x + 2].cells[y].className = "zauzeta";
				}
			}
		}
	}

	function ucitajPodatkeImpl(periodicnaP, vanrednaP) {
		periodicna = periodicnaP;
		vanredna = vanrednaP;
	}

	function nacrtajKostur(kalendarRef, prviDan, brojDana) {
		const danIme = ["PON", "UTO", "SRI", "CET", "PET", "SUB", "NED"];
		var tbody;
		tbody = "<tr><th colspan=\"7\"></th>"
		
		tbody += "</tr><tr class=\"dani\">";
		for (var i = 0; i < 7; i++) {
			tbody += "<td>" + danIme[i] + "</td>";
		}
		tbody += "</tr>";

		for (var i = 0; i < 5; i++) {
			tbody += "<tr class=\"brojevi\">";
			for (var j = 0; j < 7; j++) {
				tbody += "<td class=\"slobodna\"></td>";
			}
			tbody += "</tr>";
		}

		// Dodatni red
		if (prviDan === 6 && brojDana >= 30 || prviDan === 5 && brojDana === 31) {
			tbody += "<tr class=\"brojevi\">";
			for (var j = 0; j < 7; j++) {
				tbody += "<td class=\"slobodna\"></td>";
			}
			tbody += "</tr>";
		}
		kalendarRef.innerHTML = tbody;
	}

	function iscrtajKalendarImpl(kalendarRef, mjesec) {
		if (mjesec < 0 || mjesec > 11)
			return false;
		var prviDan = vratiPrviDanMjeseca(new Date().getFullYear(), mjesec);
		var brojDana = vratiBrojDanaUMjesecu(new Date().getFullYear(), mjesec);
		var brojac = 1;

		nacrtajKostur(kalendarRef, prviDan, brojDana);
		kalendarRef.rows[0].cells[0].innerHTML = mjesecIme[mjesec];

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