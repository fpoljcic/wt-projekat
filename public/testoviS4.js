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
				    expect(osoblje, "Osoblje ne sadrzi trazene osobe").to.deep.include.members([trazenaOsoba1, trazenaOsoba2, trazenaOsoba3]);
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
				    expect(rezervacije.vanredna, "Vanredne rezervacije ne sadrze traženu rezervaciju").to.deep.include.members([trazenaRezervacija1]);
				    expect(rezervacije.periodicna, "Periodične rezervacije ne sadrze traženu rezervaciju").to.deep.include.members([trazenaRezervacija2]);
				    done();
				}
			}
			ajax.open("GET", "http://localhost:8080/rezervacije", true);
			ajax.send();
		});

		it('Dodavanje nove periodične rezervacije: očekivano je da bude dodata u sve rezervacije', (done) => {
			// Upisujemo periodicnu rezervaciju
			var ajax = new XMLHttpRequest();
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4 && ajax.status == 200) {
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
				if (ajax.readyState == 4 && ajax.status == 200) {
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
	});
});