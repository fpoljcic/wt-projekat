let assert = chai.assert;

describe('Kalendar', function() {
	describe('iscrtajKalendar()', function() {
		it('Pozivanje iscrtajKalendar za mjesec sa 30 dana: očekivano je da se prikaže 30 dana', function() {
			var kalendar = document.getElementById("kalendarRef");

			Kalendar.iscrtajKalendar(kalendar, 5);
			var brojac = 0;

			for (var i = 2; i < kalendar.rows.length; i++) {
				for (var j = 0; j < kalendar.rows[i].cells.length; j++) {
					if (kalendar.rows[i].cells[j].innerHTML != "" && kalendar.rows[i].cells[j].style.visibility == "visible")
						brojac++;
				}
			}

			assert.equal(brojac, 30, "Mjesec juni ima 30 dana");
		});

		it('Pozivanje iscrtajKalendar za mjesec sa 31 dan: očekivano je da se prikaže 31 dan', function() {
			var kalendar = document.getElementById("kalendarRef");

			Kalendar.iscrtajKalendar(kalendar, 11);
			var brojac = 0;

			for (var i = 2; i < kalendar.rows.length; i++) {
				for (var j = 0; j < kalendar.rows[i].cells.length; j++) {
					if (kalendar.rows[i].cells[j].innerHTML != "" && kalendar.rows[i].cells[j].style.visibility == "visible")
						brojac++;
				}
			}

			assert.equal(brojac, 31, "Mjesec novembar ima 31 dan");
		});

		it('Pozivanje iscrtajKalendar za trenutni mjesec: očekivano je da je 1. dan u petak', function() {
			var kalendar = document.getElementById("kalendarRef");

			Kalendar.iscrtajKalendar(kalendar, 10);
			var i, j;

			for (i = 2; i < kalendar.rows.length; i++) {
				for (j = 0; j < kalendar.rows[i].cells.length; j++) {
					if (kalendar.rows[i].cells[j].innerHTML == "1" && kalendar.rows[i].cells[j].style.visibility == "visible")
						break;
				}
				if (j != kalendar.rows[i].cells.length)
					break;
			}

			assert.equal(i, 2, "1. dan novembra se nalazi u 3. redu (indeks = 2)");
			assert.equal(j, 4, "1. dan novembra se nalazi u 5. koloni (indeks = 4)");
		});

		it('Pozivanje iscrtajKalendar za trenutni mjesec: očekivano je da je 30. dan u subotu', function() {
			var kalendar = document.getElementById("kalendarRef");

			Kalendar.iscrtajKalendar(kalendar, 10);
			var i, j;

			for (i = 2; i < kalendar.rows.length; i++) {
				for (j = 0; j < kalendar.rows[i].cells.length; j++) {
					if (kalendar.rows[i].cells[j].innerHTML == "30" && kalendar.rows[i].cells[j].style.visibility == "visible")
						break;
				}
				if (j != kalendar.rows[i].cells.length)
					break;
			}

			assert.equal(i, 6, "30. dan novembra se nalazi u 7. redu (indeks = 6)");
			assert.equal(j, 5, "30. dan novembra se nalazi u 6. koloni (indeks = 5)");
		});

		it('Pozivanje iscrtajKalendar za januar: očekivano je da brojevi dana idu od 1 do 31 počevši od utorka', function() {
			var kalendar = document.getElementById("kalendarRef");

			Kalendar.iscrtajKalendar(kalendar, 0);
			var redPrvog, kolonaPrvog, brojac = 0;

			for (var i = 2; i < kalendar.rows.length; i++) {
				for (var j = 0; j < kalendar.rows[i].cells.length; j++) {
					if (kalendar.rows[i].cells[j].innerHTML != "" && kalendar.rows[i].cells[j].style.visibility == "visible") {
						brojac++;
						assert.equal(kalendar.rows[i].cells[j].innerHTML, brojac, brojac + ". dan treba biti označen sa " + brojac);
						if (kalendar.rows[i].cells[j].innerHTML == "1") {
							redPrvog = i;
							kolonaPrvog = j;
						}
					}
				}
			}

			assert.equal(redPrvog, 2, "1. dan januara se nalazi u 3. redu (indeks = 2)");
			assert.equal(kolonaPrvog, 1, "1. dan januara se nalazi u 2. koloni (indeks = 1)");
		});

		it('Moj test 1: Testiranje februara, ima 28 dana, zadnji je u četvrtak', function() {
			var kalendar = document.getElementById("kalendarRef");

			Kalendar.iscrtajKalendar(kalendar, 1);
			var redZadnjeg, kolonaZadnjeg, brojac = 0;

			for (var i = 2; i < kalendar.rows.length; i++) {
				for (var j = 0; j < kalendar.rows[i].cells.length; j++) {
					if (kalendar.rows[i].cells[j].innerHTML != "" && kalendar.rows[i].cells[j].style.visibility == "visible") {
						brojac++;
						if (kalendar.rows[i].cells[j].innerHTML == "28") {
							redZadnjeg = i;
							kolonaZadnjeg = j;
						}
					}
				}
			}

			assert.equal(redZadnjeg, 6, "28. dan februara se nalazi u 3. redu (indeks = 2)");
			assert.equal(kolonaZadnjeg, 3, "28. dan februara se nalazi u 2. koloni (indeks = 1)");
			assert.equal(brojac, 28, "Mjesec februar ima 28 dana");
		});

		it('Moj test 2: Testiranje rednog broja za svaki ponedjeljak u mjesecu julu', function() {
			var kalendar = document.getElementById("kalendarRef");

			Kalendar.iscrtajKalendar(kalendar, 6);

			for (var i = 2; i < kalendar.rows.length - 1; i++) {
				assert.equal(kalendar.rows[i].cells[0].innerHTML, 1 + (i - 2) * 7, (i - 1) + ". ponedjeljak se nalazi u " + (i + 1) + ". redu (indeks = " + i + "), 1. koloni (indeks = 0)");
			}
		});
	});

	describe('obojiZauzeca()', function() {
		it('Pozivanje obojiZauzeca kada podaci nisu učitani: očekivana vrijednost da se ne oboji niti jedan dan', function() {
			var kalendar = document.getElementById("kalendarRef");
			Kalendar.obojiZauzeca(kalendar, 10, "1-01", "10:00", "12:00");

			for (var i = 2; i < kalendar.rows.length; i++) {
				for (var j = 0; j < kalendar.rows[i].cells.length; j++) {
					if (kalendar.rows[i].cells[j].innerHTML != "" && kalendar.rows[i].cells[j].style.visibility == "visible")
						assert.equal("slobodna", kalendar.rows[i].cells[j].className, "Sve ćelije trebaju biti obojene u zeleno");
				}
			}
		});

		it('Pozivanje obojiZauzeca gdje u zauzecima postoje duple vrijednosti za zauzeće istog termina: očekivano je da se dan oboji bez obzira što postoje duple vrijednosti', function() {
			var kalendar = document.getElementById("kalendarRef");
			var vanredna = [{datum: "01.11.2019", pocetak: "10:00", kraj: "12:00", naziv: "0-01", predavac: "Faris"},
			{datum: "01.11.2019", pocetak: "10:00", kraj: "12:00", naziv: "0-01", predavac: "Armin"},
			{datum: "28.11.2019", pocetak: "10:00", kraj: "12:00", naziv: "0-01", predavac: "Amra"},
			{datum: "30.11.2019", pocetak: "10:00", kraj: "12:00", naziv: "0-01", predavac: "Sile"},
			{datum: "30.11.2019", pocetak: "10:00", kraj: "12:00", naziv: "0-01", predavac: "Adin"}];
			Kalendar.ucitajPodatke(null, vanredna);
			Kalendar.obojiZauzeca(kalendar, 10, "0-01", "10:00", "12:00");

			for (var i = 2; i < kalendar.rows.length; i++) {
				for (var j = 0; j < kalendar.rows[i].cells.length; j++) {
					if (kalendar.rows[i].cells[j].innerHTML == "" || kalendar.rows[i].cells[j].style.visibility != "visible")
						continue;
					if (i == 2 && j == 4 || i == 6 && j == 3 || i == 6 && j == 5)
						assert.equal("zauzeta", kalendar.rows[i].cells[j].className, "Ćelije 1, 28 i 30 trebaju biti obojene u crvenu");
					else
						assert.equal("slobodna", kalendar.rows[i].cells[j].className, "Sve ćelije osim ćelija 1, 28 i 30 trebaju biti obojene u zelenu");
				}
			}
		});

		it('Pozivanje obojiZauzece kada u podacima postoji periodično zauzeće za drugi semestar: očekivano je da se ne oboji zauzeće', function() {
			var kalendar = document.getElementById("kalendarRef");
			var periodicna = [{dan: 0, semestar: "ljetni", pocetak: "10:00", kraj: "12:00", naziv: "0-02", predavac: "Vedran"},
			{dan: 3, semestar: "ljetni", pocetak: "10:00", kraj: "12:00", naziv: "0-02", predavac: "Emir"},
			{dan: 4, semestar: "ljetni", pocetak: "10:00", kraj: "12:00", naziv: "0-02", predavac: "Juric"},
			{dan: 6, semestar: "zimski", pocetak: "10:00", kraj: "12:00", naziv: "0-02", predavac: "Dzenana"}];
			Kalendar.ucitajPodatke(periodicna, null);
			Kalendar.obojiZauzeca(kalendar, 10, "0-02", "10:00", "12:00");

			for (var i = 2; i < kalendar.rows.length; i++) {
				for (var j = 0; j < kalendar.rows[i].cells.length; j++) {
					if (kalendar.rows[i].cells[j].innerHTML == "" || kalendar.rows[i].cells[j].style.visibility != "visible")
						continue;
					if (i == 2 && j == 6 || i == 3 && j == 6 || i == 4 && j == 6 || i == 5 && j == 6)
						assert.equal("zauzeta", kalendar.rows[i].cells[j].className, "Ćelije 3, 10, 17 i 24 trebaju biti obojene u crvenu");
					else
						assert.equal("slobodna", kalendar.rows[i].cells[j].className, "Sve ćelije osim ćelija 3, 10, 17 i 24 trebaju biti obojene u zelenu");
				}
			}
		});

		it('Pozivanje obojiZauzece kada u podacima postoji zauzeće termina ali u drugom mjesecu: očekivano je da se ne oboji zauzeće', function() {
			var kalendar = document.getElementById("kalendarRef");
			var vanredna = [{datum: "01.12.2019", pocetak: "20:00", kraj: "22:00", naziv: "VA1", predavac: "Faris"},
			{datum: "31.12.2019", pocetak: "20:00", kraj: "22:00", naziv: "VA1", predavac: "Armin"},
			{datum: "02.03.2019", pocetak: "20:00", kraj: "22:00", naziv: "VA1", predavac: "Amra"},
			{datum: "07.07.2019", pocetak: "20:00", kraj: "22:00", naziv: "VA1", predavac: "Sile"},
			{datum: "07.11.2019", pocetak: "20:00", kraj: "22:00", naziv: "VA1", predavac: "Adin"}];
			Kalendar.ucitajPodatke(null, vanredna);
			Kalendar.obojiZauzeca(kalendar, 10, "VA1", "20:00", "22:00");

			for (var i = 2; i < kalendar.rows.length; i++) {
				for (var j = 0; j < kalendar.rows[i].cells.length; j++) {
					if (kalendar.rows[i].cells[j].innerHTML == "" || kalendar.rows[i].cells[j].style.visibility != "visible")
						continue;
					if (i == 3 && j == 3)
						assert.equal("zauzeta", kalendar.rows[i].cells[j].className, "Ćelija 7 treba biti obojena u crvenu");
					else
						assert.equal("slobodna", kalendar.rows[i].cells[j].className, "Sve ćelije osim ćelije 7 trebaju biti obojene u zelenu");
				}
			}
		});

		it('Pozivanje obojiZauzece kada su u podacima svi termini u mjesecu zauzeti: očekivano je da se svi dani oboje', function() {
			var kalendar = document.getElementById("kalendarRef");
			var periodicna = [{dan: 0, semestar: "zimski", pocetak: "15:00", kraj: "17:00", naziv: "EE1", predavac: "Vedran"},
			{dan: 1, semestar: "zimski", pocetak: "15:00", kraj: "17:00", naziv: "EE1", predavac: "Emir"},
			{dan: 2, semestar: "zimski", pocetak: "15:00", kraj: "17:00", naziv: "EE1", predavac: "Juric"},
			{dan: 3, semestar: "zimski", pocetak: "15:00", kraj: "17:00", naziv: "EE1", predavac: "Dzenana"},
			{dan: 4, semestar: "zimski", pocetak: "15:00", kraj: "17:00", naziv: "EE1", predavac: "Vedran"},
			{dan: 5, semestar: "zimski", pocetak: "15:00", kraj: "17:00", naziv: "EE1", predavac: "Juric"},
			{dan: 6, semestar: "zimski", pocetak: "15:00", kraj: "17:00", naziv: "EE1", predavac: "Zenan"}];
			Kalendar.ucitajPodatke(periodicna, null);
			Kalendar.obojiZauzeca(kalendar, 11, "EE1", "15:00", "17:00");

			for (var i = 2; i < kalendar.rows.length; i++) {
				for (var j = 0; j < kalendar.rows[i].cells.length; j++) {
					if (kalendar.rows[i].cells[j].innerHTML != "" && kalendar.rows[i].cells[j].style.visibility == "visible")
						assert.equal("zauzeta", kalendar.rows[i].cells[j].className, "Sve ćelije trebaju biti obojene u crvenu");
				}
			}
		});

		it('Dva puta uzastopno pozivanje obojiZauzece: očekivano je da boja zauzeća ostane ista', function() {
			var kalendar = document.getElementById("kalendarRef");
			var vanredna = [{datum: "01.11.2019", pocetak: "07:00", kraj: "09:00", naziv: "MA", predavac: "Faris"},
			{datum: "21.11.2019", pocetak: "07:00", kraj: "09:00", naziv: "MA", predavac: "Armin"},
			{datum: "30.11.2019", pocetak: "07:00", kraj: "09:00", naziv: "MA", predavac: "Amra"}];
			var periodicna = [{dan: 0, semestar: "zimski", pocetak: "07:00", kraj: "09:00", naziv: "MA", predavac: "Vedran"}];
			Kalendar.ucitajPodatke(periodicna, vanredna);
			var obojeniX = [];
			var obojeniY = [];
			var brojac 


			// 1. poziv - PERIODICNA
			Kalendar.obojiZauzeca(kalendar, 10, "MA", "07:00", "09:00");
			for (var i = 2; i < kalendar.rows.length; i++) {
				for (var j = 0; j < kalendar.rows[i].cells.length; j++) {
					if (kalendar.rows[i].cells[j].innerHTML != "" && kalendar.rows[i].cells[j].style.visibility == "visible" && kalendar.rows[i].cells[j].className == "zauzeta") {
						obojeniX.push(i);
						obojeniY.push(j);
					}
				}
			}

			// 2. poziv - PERIODICNA
			Kalendar.obojiZauzeca(kalendar, 10, "MA", "07:00", "09:00");
			for (var i = 2; i < kalendar.rows.length; i++) {
				for (var j = 0; j < kalendar.rows[i].cells.length; j++) {
					if (kalendar.rows[i].cells[j].innerHTML == "" || kalendar.rows[i].cells[j].style.visibility != "visible")
						continue;
					if (i == obojeniX[0] && j == obojeniY[0]) {
						assert.equal("zauzeta", kalendar.rows[i].cells[j].className, "2. uzastopni poziv metode obojiZauzeca ne treba izmjenit boju zauzeca (periodicne rezervacije)");
						obojeniX.shift();
						obojeniY.shift();
					}
					else
						assert.equal("slobodna", kalendar.rows[i].cells[j].className, "2. uzastopni poziv metode obojiZauzeca ne treba izmjenit boju zauzeca (periodicne rezervacije)");
				}
			}


			// 1. poziv - VANREDNA
			Kalendar.obojiZauzeca(kalendar, 10, "MA", "07:00", "09:00");
			for (var i = 2; i < kalendar.rows.length; i++) {
				for (var j = 0; j < kalendar.rows[i].cells.length; j++) {
					if (kalendar.rows[i].cells[j].innerHTML != "" && kalendar.rows[i].cells[j].style.visibility == "visible" && kalendar.rows[i].cells[j].className == "zauzeta") {
						obojeniX.push(i);
						obojeniY.push(j);
					}
				}
			}

			// 2. poziv - VANREDNA
			Kalendar.obojiZauzeca(kalendar, 10, "MA", "07:00", "09:00");
			for (var i = 2; i < kalendar.rows.length; i++) {
				for (var j = 0; j < kalendar.rows[i].cells.length; j++) {
					if (kalendar.rows[i].cells[j].innerHTML == "" || kalendar.rows[i].cells[j].style.visibility != "visible")
						continue;
					if (i == obojeniX[0] && j == obojeniY[0]) {
						assert.equal("zauzeta", kalendar.rows[i].cells[j].className, "2. uzastopni poziv metode obojiZauzeca ne treba izmjenit boju zauzeca (vanredne rezervacije)");
						obojeniX.shift();
						obojeniY.shift();
					}
					else
						assert.equal("slobodna", kalendar.rows[i].cells[j].className, "2. uzastopni poziv metode obojiZauzeca ne treba izmjenit boju zauzeca (vanredne rezervacije)");
				}
			}
		});

		it('Pozivanje ucitajPodatke, obojiZauzeca, ucitajPodatke - drugi podaci, obojiZauzeca: očekivano da se zauzeća iz prvih podataka ne ostanu obojena, tj. primjenjuju se samo posljednje učitani podaci', function() {
			var kalendar = document.getElementById("kalendarRef");
			var vanredna = [{datum: "01.02.2019", pocetak: "14:00", kraj: "14:30", naziv: "1-09", predavac: "Faris"},
			{datum: "07.02.2019", pocetak: "14:00", kraj: "14:30", naziv: "1-09", predavac: "Armin"},
			{datum: "20.02.2019", pocetak: "14:00", kraj: "14:30", naziv: "1-09", predavac: "Amra"},
			{datum: "25.02.2019", pocetak: "14:00", kraj: "14:30", naziv: "1-09", predavac: "Sile"}];
			Kalendar.ucitajPodatke(null, vanredna);
			Kalendar.obojiZauzeca(kalendar, 1, "1-09", "14:00", "14:30");

			// Prvo bojenje - test
			for (var i = 2; i < kalendar.rows.length; i++) {
				for (var j = 0; j < kalendar.rows[i].cells.length; j++) {
					if (kalendar.rows[i].cells[j].innerHTML == "" || kalendar.rows[i].cells[j].style.visibility != "visible")
						continue;
					if (i == 2 && j == 4 || i == 3 && j == 3 || i == 5 && j == 2 || i == 6 && j == 0)
						assert.equal("zauzeta", kalendar.rows[i].cells[j].className, "Ćelije 1, 7, 20 i 25 trebaju biti obojene u crvenu");
					else
						assert.equal("slobodna", kalendar.rows[i].cells[j].className, "Sve ćelije osim ćelija 1, 7, 20 i 25 trebaju biti obojene u zelenu");
				}
			}

			vanredna = [{datum: "11.02.2019", pocetak: "14:00", kraj: "14:30", naziv: "1-09", predavac: "Faris"},
			{datum: "14.02.2019", pocetak: "14:00", kraj: "14:30", naziv: "1-09", predavac: "Armin"},
			{datum: "26.02.2019", pocetak: "14:00", kraj: "14:30", naziv: "1-09", predavac: "Amra"},
			{datum: "27.02.2019", pocetak: "14:00", kraj: "14:30", naziv: "1-09", predavac: "Sile"}];
			Kalendar.ucitajPodatke(null, vanredna);
			Kalendar.obojiZauzeca(kalendar, 1, "1-09", "14:00", "14:30");

			// Drugo bojenje - test
			for (var i = 2; i < kalendar.rows.length; i++) {
				for (var j = 0; j < kalendar.rows[i].cells.length; j++) {
					if (kalendar.rows[i].cells[j].innerHTML == "" || kalendar.rows[i].cells[j].style.visibility != "visible")
						continue;
					if (i == 4 && j == 0 || i == 4 && j == 3 || i == 6 && j == 1 || i == 6 && j == 2)
						assert.equal("zauzeta", kalendar.rows[i].cells[j].className, "Ćelije 11, 14, 26 i 27 trebaju biti obojene u crvenu");
					else
						assert.equal("slobodna", kalendar.rows[i].cells[j].className, "Sve ćelije osim ćelija 11, 14, 26 i 27 trebaju biti obojene u zelenu");
				}
			}
		});

		it('Moj test 1: Test intervala, filtriranje od 10:00 do 14:00, zauzeće 1 stavljeno od 12:00 do 14:00, zauzeće 2 od 14:00 do 16:00', function() {
			var kalendar = document.getElementById("kalendarRef");
			var vanredna = [{datum: "05.11.2019", pocetak: "12:00", kraj: "14:00", naziv: "1-08", predavac: "Faris"},
							{datum: "06.11.2019", pocetak: "14:00", kraj: "16:00", naziv: "1-08", predavac: "Amir"}];
			Kalendar.ucitajPodatke(null, vanredna);
			Kalendar.obojiZauzeca(kalendar, 10, "1-08", "10:00", "14:00");

			assert.equal("zauzeta", kalendar.rows[3].cells[1].className, "Zauzeće 1 treba biti prikazano (boja crvena)");
			assert.equal("slobodna", kalendar.rows[3].cells[2].className, "Zauzeće 2 ne treba biti prikazano (boja zelena)");
		});

		it('Moj test 2: Testiranje filtriranja po sali, 5 zauzeća u različitim salama, filtrirat ćemo jednu', function() {
			var kalendar = document.getElementById("kalendarRef");
			var periodicna = [{dan: 0, semestar: "zimski", pocetak: "19:30", kraj: "20:45", naziv: "VA2", predavac: "Vedran"},
			{dan: 1, semestar: "zimski", pocetak: "19:30", kraj: "20:45", naziv: "MA", predavac: "Emir"},
			{dan: 2, semestar: "zimski", pocetak: "19:30", kraj: "20:45", naziv: "EE1", predavac: "Juric"},
			{dan: 3, semestar: "zimski", pocetak: "19:30", kraj: "20:45", naziv: "1-09", predavac: "Dzenana"},
			{dan: 4, semestar: "zimski", pocetak: "19:30", kraj: "20:45", naziv: "0-01", predavac: "Vedran"}];
			Kalendar.ucitajPodatke(periodicna, null);
			Kalendar.obojiZauzeca(kalendar, 0, "1-09", "19:30", "23:00");

			for (var i = 2; i < kalendar.rows.length; i++) {
				for (var j = 0; j < kalendar.rows[i].cells.length; j++) {
					if (kalendar.rows[i].cells[j].innerHTML == "" || kalendar.rows[i].cells[j].style.visibility != "visible")
						continue;
					if (j == 3)
						assert.equal("zauzeta", kalendar.rows[i].cells[j].className, "Zauzeće četvrtkom u sali 1-09 treba biti prikazano (boja crvena)");
					else
						assert.equal("slobodna", kalendar.rows[i].cells[j].className, "Zauzeće u ostalim salama ne treba biti prikazano (boja crvena)");
				}
			}
		});
	});
});