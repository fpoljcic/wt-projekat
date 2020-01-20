let assert = chai.assert;
let expect = chai.expect;

describe('Testovi serverskih funkcionalnosti', function() {
	describe('a) GET /osoblje', function() {
		it('Slanje GET zahtjeva na /osoblje: očekivano je da su sadržane osobe iz postavke', (done) => {
			var ajax = new XMLHttpRequest();
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4 && ajax.status == 200) {
					var osoblje = JSON.parse(ajax.responseText);
					var trazenaOsoba1 = {
				        id: 1,
				        ime: 'Neko',
				        prezime: 'Nekić',
				        uloga: 'profesor'
				    };
				    var trazenaOsoba2 = {
				        id: 2,
				        ime: 'Drugi',
				        prezime: 'Neko',
				        uloga: 'asistent'
				    };
				    var trazenaOsoba3 = {
				        id: 3,
				        ime: 'Test',
				        prezime: 'Test',
				        uloga: 'asistent'
				    };
				    expect(osoblje, "Osoblje ne sadrži tražene osobe").to.deep.include.members([trazenaOsoba1, trazenaOsoba2, trazenaOsoba3]);
				    done();
				}
			}
			ajax.open("GET", "http://localhost:8080/osoblje", true);
			ajax.send();
		});

		it('Učitavanje rezervacija.html stranice: očekivano je da select sadrži osoblje', (done) => {
			var ajax = new XMLHttpRequest();
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4 && ajax.status == 200) {
					var osobljeSelect = document.getElementsByName("osoblje")[0];
				    assert.include(osobljeSelect.innerHTML, 'Neko Nekić', 'Neko Nekić mora biti sadržan u select-u');
				    assert.include(osobljeSelect.innerHTML, 'Drugi Neko', 'Drugi Neko mora biti sadržan u select-u');
				    assert.include(osobljeSelect.innerHTML, 'Test Test', 'Test Test mora biti sadržan u select-u');
				    done();
				}
			}
			ajax.open("GET", "http://localhost:8080/osoblje", true);
			ajax.send();
		});
	});


	describe('b) Dohvatanje svih zauzeća', function() {
		it('Slanje GET zahtjeva na /rezervacije: očekivano je da su sadržane rezervacije iz postavke', (done) => {
			var ajax = new XMLHttpRequest();
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4 && ajax.status == 200) {
					var rezervacije = JSON.parse(ajax.responseText);
					var trazenaRezervacija1 = {
				        datum: '01.01.2020',
				        pocetak: '12:00',
				        kraj: '13:00',
				        naziv: '1-11',
				        predavac: 'Neko Nekić (profesor)'
				    };
				    var trazenaRezervacija2 = {
				        dan: 0,
				        semestar: 'zimski',
				        pocetak: '13:00',
				        kraj: '14:00',
				        naziv: '1-11',
				        predavac: 'Test Test (asistent)'
				    };
				    expect(rezervacije.vanredna, "Vanredne rezervacije ne sadrže traženu rezervaciju").to.deep.include.members([trazenaRezervacija1]);
				    expect(rezervacije.periodicna, "Periodične rezervacije ne sadrže traženu rezervaciju").to.deep.include.members([trazenaRezervacija2]);
				    done();
				}
			}
			ajax.open("GET", "http://localhost:8080/rezervacije", true);
			ajax.send();
		});

		it('Dodavanje nove periodične rezervacije: očekivano je da zauzeća budu ažurirana', (done) => {
			// Upisujemo periodicnu rezervaciju
			var ajax = new XMLHttpRequest();
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4 && (ajax.status == 200 || ajax.status == 409)) {
					// Ucitavamo sve rezervacije
					if (ajax.status == 409)
						Pozivi.ucitajSaServera();
					else {
						var podaci = JSON.parse(ajax.responseText);
						Kalendar.ucitajPodatke(podaci.periodicna, podaci.vanredna);
						azurirajPrikaz(document.getElementById("kalendarRef"));
					}
					// Postavljamo filter
					document.getElementsByName("pocetak")[0].value = "02:00";
					document.getElementsByName("kraj")[0].value = "02:30";
					document.getElementsByName("sale")[0].value = "1-11";
					var kalendar = document.getElementById("kalendarRef");
					trenutniMjesec = 1;
					Kalendar.iscrtajKalendar(kalendar, trenutniMjesec);

					// Neophodno da bi azurirali prikaz zauzeca na kalendaru
					document.getElementsByName("sale")[0].dispatchEvent(new Event("change"));

					for (var i = 2; i < kalendar.rows.length; i++) {
						for (var j = 0; j < kalendar.rows[i].cells.length; j++) {
							if (kalendar.rows[i].cells[j].innerHTML == "" || kalendar.rows[i].cells[j].style.visibility != "visible")
								continue;
							if (j == 1)
								assert.equal(kalendar.rows[i].cells[j].className, "zauzeta", "Zauzeće utorkom u sali 1-11 treba biti prikazano (boja crvena)");
						}
					}
					done();
				}
			}
			ajax.open("POST", "http://localhost:8080/periodicna", true);
			ajax.setRequestHeader("Content-Type", "application/json");
			ajax.send(JSON.stringify({dan:1, semestar:'ljetni', pocetak:'02:00', kraj:'02:30', naziv:'1-11', predavac:2, datumS:'07.01.2020'}));
		});

		it('Dodavanje nove vanredne rezervacije: očekivano je da zauzeća budu ažurirana', (done) => {
			// Upisujemo vanrednu rezervaciju
			var ajax = new XMLHttpRequest();
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4 && (ajax.status == 200 || ajax.status == 409)) {
					// Ucitavamo sve rezervacije
					if (ajax.status == 409)
						Pozivi.ucitajSaServera();
					else {
						var podaci = JSON.parse(ajax.responseText);
						Kalendar.ucitajPodatke(podaci.periodicna, podaci.vanredna);
						azurirajPrikaz(document.getElementById("kalendarRef"));
					}
					// Postavljamo filter
					document.getElementsByName("pocetak")[0].value = "22:00";
					document.getElementsByName("kraj")[0].value = "23:59";
					document.getElementsByName("sale")[0].value = "1-15";
					var kalendar = document.getElementById("kalendarRef");
					trenutniMjesec = 9;
					Kalendar.iscrtajKalendar(kalendar, trenutniMjesec);

					// Neophodno da bi azurirali prikaz zauzeca na kalendaru
					document.getElementsByName("sale")[0].dispatchEvent(new Event("change"));
					
					assert.equal(kalendar.rows[4].cells[2].className, "zauzeta", "Zauzeće 14.10.2020 u sali 1-15 treba biti prikazano (boja crvena)");
					done();
				}
			}
			ajax.open("POST", "http://localhost:8080/vanredna", true);
			ajax.setRequestHeader("Content-Type", "application/json");
			ajax.send(JSON.stringify({datum:'14.10.2020', pocetak:'22:00', kraj:'23:00', naziv:'1-15', predavac:2}));
		});
	});


	describe('c) Dohvatanje svih sala', function() {
		it('Slanje GET zahtjeva na /sale: očekivano je da su sadržane sale iz postavke', (done) => {
			var ajax = new XMLHttpRequest();
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4 && ajax.status == 200) {
					var sale = JSON.parse(ajax.responseText);
					var trazenaSala1 = {
				        id: 1,
				        naziv: '1-11',
				        zaduzenaOsoba: 1
				    };
				    var trazenaSala2 = {
				        id: 2,
				        naziv: '1-15',
				        zaduzenaOsoba: 2
				    };
				    expect(sale, "Sale ne sadrže salu 1-11 ili 1-15").to.deep.include.members([trazenaSala1, trazenaSala2]);
				    done();
				}
			}
			ajax.open("GET", "http://localhost:8080/sale", true);
			ajax.send();
		});

		it('Učitavanje rezervacija.html stranice: očekivano je da select sadrži sale', (done) => {
			var ajax = new XMLHttpRequest();
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4 && ajax.status == 200) {
					var saleSelect = document.getElementsByName("sale")[0];
				    assert.include(saleSelect.innerHTML, '1-11', 'Sala 1-11 mora biti sadržana u select-u');
				    assert.include(saleSelect.innerHTML, '1-15', 'Sala 1-15 mora biti sadržana u select-u');
				    done();
				}
			}
			ajax.open("GET", "http://localhost:8080/sale", true);
			ajax.send();
		});
	});


	describe('d) Kreiranje nove rezervacije', function() {
		it('Dodavanje nove periodične rezervacije: očekivano je da bude dodata u sve rezervacije', (done) => {
			// Upisujemo periodicnu rezervaciju
			var ajax = new XMLHttpRequest();
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4 && (ajax.status == 200 || ajax.status == 409)) {
					// Dobavljamo sve rezervacije
					ajax = new XMLHttpRequest();
					ajax.onreadystatechange = function () {
						if (ajax.readyState == 4 && ajax.status == 200) {
							var rezervacije = JSON.parse(ajax.responseText);
						    var trazenaRezervacija = {
						        dan: 6,
						        semestar: 'zimski',
						        pocetak: '10:00',
						        kraj: '11:00',
						        naziv: '1-15',
						        predavac: 'Drugi Neko (asistent)'
						    };
						    expect(rezervacije.periodicna, "Periodične rezervacije ne sadrže novo dodanu rezervaciju").to.deep.include.members([trazenaRezervacija]);
						    done();
						}
					}
					ajax.open("GET", "http://localhost:8080/rezervacije", true);
					ajax.send();
				}
			}
			ajax.open("POST", "http://localhost:8080/periodicna", true);
			ajax.setRequestHeader("Content-Type", "application/json");
			ajax.send(JSON.stringify({dan:6, semestar:'zimski', pocetak:'10:00', kraj:'11:00', naziv:'1-15', predavac:2, datumS:'19.01.2020'}));
		});

		it('Dodavanje nove vanredne rezervacije: očekivano je da bude dodata u sve rezervacije', (done) => {
			// Upisujemo vanrednu rezervaciju
			var ajax = new XMLHttpRequest();
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4 && (ajax.status == 200 || ajax.status == 409)) {
					// Dobavljamo sve rezervacije
					ajax = new XMLHttpRequest();
					ajax.onreadystatechange = function () {
						if (ajax.readyState == 4 && ajax.status == 200) {
							var rezervacije = JSON.parse(ajax.responseText);
						    var trazenaRezervacija = {
						        datum: '03.01.2020',
						        pocetak: '08:00',
						        kraj: '11:00',
						        naziv: '1-11',
						        predavac: 'Neko Nekić (profesor)'
						    };
						    expect(rezervacije.vanredna, "Vanredne rezervacije ne sadrže novo dodanu rezervaciju").to.deep.include.members([trazenaRezervacija]);
						    done();
						}
					}
					ajax.open("GET", "http://localhost:8080/rezervacije", true);
					ajax.send();
				}
			}
			ajax.open("POST", "http://localhost:8080/vanredna", true);
			ajax.setRequestHeader("Content-Type", "application/json");
			ajax.send(JSON.stringify({datum:'03.01.2020', pocetak:'08:00', kraj:'11:00', naziv:'1-11', predavac:1}));
		});

		it('Preklapanje periodične rezervacije sa postojećom (ista osoba): očekivana je poruka sa opisom greške', (done) => {
			// Upisujemo periodicnu rezervaciju koja vec postoji
			var ajax = new XMLHttpRequest();
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4 && ajax.status == 409) {
					var ocekivaniTekst = "Nije moguće rezervisati salu 1-11 za navedeni datum 27.01.2020 i termin od 13:30 do 15:00!\nRezervisao: Test Test (asistent)";
					assert.equal(ajax.responseText, ocekivaniTekst, "Ispis greške nije u skladu sa postavkom");
					done();
				}
			}
			ajax.open("POST", "http://localhost:8080/periodicna", true);
			ajax.setRequestHeader("Content-Type", "application/json");
			ajax.send(JSON.stringify({dan:0, semestar:'zimski', pocetak:'13:30', kraj:'15:00', naziv:'1-11', predavac:3, datumS:'27.01.2020'}));
		});

		it('Preklapanje vanredne rezervacije sa postojećom (druga osoba): očekivana je poruka sa opisom greške', (done) => {
			// Upisujemo periodicnu rezervaciju koja vec postoji
			var ajax = new XMLHttpRequest();
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4 && ajax.status == 409) {
					var ocekivaniTekst = "Nije moguće rezervisati salu 1-11 za navedeni datum 01/01/2020 i termin od 10:00 do 12:30!\nRezervisao: Neko Nekić (profesor)";
					assert.equal(ajax.responseText, ocekivaniTekst, "Ispis greške nije u skladu sa postavkom");
					done();
				}
			}
			ajax.open("POST", "http://localhost:8080/vanredna", true);
			ajax.setRequestHeader("Content-Type", "application/json");
			ajax.send(JSON.stringify({datum:'01.01.2020', pocetak:'10:00', kraj:'12:30', naziv:'1-11', predavac:2}));
		});
	});
});