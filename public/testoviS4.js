let assert = chai.assert;

describe('Testovi serverskih funkcionalnosti', function() {
	describe('a) GET /osoblje', function() {
		it('Pozivanje iscrtajKalendar za mjesec sa 30 dana: očekivano je da se prikaže 30 dana', function() {
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
				    alert(osoblje);
				    assert.include(osoblje, trazenaOsoba1, 'Osoblje mora sadrzati osobu: Neko Nekić');
				    assert.include(osoblje, trazenaOsoba2, 'Osoblje mora sadrzati osobu: Drugi Neko');
				    assert.include(osoblje, trazenaOsoba3, 'Osoblje mora sadrzati osobu: Test Test');
				}
			}
			ajax.open("GET", "http://localhost:8080/osoblje", true);
			ajax.send();
		});
	});
});