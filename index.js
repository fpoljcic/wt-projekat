const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const urlExists = require('url-exists');
const db = require('./db.js');
const { Op } = require("sequelize");
var cors = require('cors');
const app = express();
const port = 8080;

// Neophodno radi mogucnosti slanja ajax zahtjeva za testove
app.use(cors());

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
	res.sendFile(__dirname + "/pocetna.html");
});

app.get('/pocetna.html', function (req, res) {
	res.sendFile(__dirname + "/pocetna.html");
});

app.get('/sale.html', function (req, res) {
	res.sendFile(__dirname + "/sale.html");
});

app.get('/unos.html', function (req, res) {
	res.sendFile(__dirname + "/unos.html");
});

app.get('/rezervacija.html', function (req, res) {
	res.sendFile(__dirname + "/rezervacija.html");
});

app.get('/osobe.html', function (req, res) {
	res.sendFile(__dirname + "/osobe.html");
});

app.get('/rezervacije', function (req, res) {
	vratiSveRezervacije(res);
});

function vratiSveRezervacije(res) {
	db.rezervacija.findAll({
		include: [{ model: db.termin, as: 'rezervacijaTermin' },
				  { model: db.osoblje, as: 'rezervacijaOsoblje' },
				  { model: db.sala, as: 'rezervacijaSala' }]
	}).then(function (termini) {
		var podaci = {              
		    periodicna: [], 
		    vanredna: []
		};
		for(var i in termini) {
			var rezervacija = {};
			rezervacija.pocetak = termini[i].rezervacijaTermin.pocetak.substring(0, 5);
			rezervacija.kraj = termini[i].rezervacijaTermin.kraj.substring(0, 5);;
			rezervacija.naziv = termini[i].rezervacijaSala.naziv;
			rezervacija.predavac = termini[i].rezervacijaOsoblje.ime + " " + termini[i].rezervacijaOsoblje.prezime + " (" + termini[i].rezervacijaOsoblje.uloga + ")";
			if (termini[i].rezervacijaTermin.redovni) {
				rezervacija.dan = termini[i].rezervacijaTermin.dan;
				rezervacija.semestar = termini[i].rezervacijaTermin.semestar;
				podaci.periodicna.push(rezervacija);
			}
			else {
				rezervacija.datum = termini[i].rezervacijaTermin.datum;
				podaci.vanredna.push(rezervacija);
			}
		}
		res.send(podaci);
    });
}

app.get('/osoblje', function (req, res) {
	db.osoblje.findAll().then(function (osoblje) {
		res.send(osoblje);
    });
});

app.get('/saleOsoblja', function (req, res) {
	var trenutnoDatumVrijeme = new Date();
	var trenutniDatum = trenutnoDatumVrijeme.getDate() + "." + trenutnoDatumVrijeme.getMonth() + 1 + "." + trenutnoDatumVrijeme.getFullYear();
	var trenutnoVrijeme = trenutnoDatumVrijeme.getHours() + ":" + trenutnoDatumVrijeme.getMinutes();
	let mjesec = vratiMjesecIzDatuma(trenutniDatum);
	let prviDan = vratiPrviDanMjeseca(new Date().getFullYear(), mjesec);
	let dan = vratiDanIzDatuma(trenutniDatum);
	let danUSedmici = (prviDan + (dan % 7)) % 7;
	let semestar = "zimski"
	if (vratiNizMjeseciSemestra("ljetni").includes(mjesec))
		semestar = "ljetni";
	db.rezervacija.findAll({
		include: [{ model: db.termin, as: 'rezervacijaTermin', where: {[Op.or]: [{redovni: false, datum: trenutniDatum}, {redovni: true, dan: danUSedmici}]} },
				  { model: db.osoblje, as: 'rezervacijaOsoblje' },
				  { model: db.sala, as: 'rezervacijaSala' }]
	}).then(function (termini) {
		var idDodatogOsoblja = [];
		var podaci = [];
		for(var i in termini) {
			var pocetakR = termini[i].rezervacijaTermin.pocetak.substring(0, 5);
			var krajR = termini[i].rezervacijaTermin.kraj.substring(0, 5);
			if (nalaziSeUIntervalu(trenutnoVrijeme, trenutnoVrijeme, pocetakR, krajR)) {
				idDodatogOsoblja.push(termini[i].rezervacijaOsoblje.id);
				var osobaImeIPrezime = termini[i].rezervacijaOsoblje.ime + " " + termini[i].rezervacijaOsoblje.prezime;
				var osobaSala = termini[i].rezervacijaSala.naziv;
				var objekat = {
					osoba: osobaImeIPrezime,
					sala: osobaSala
				};
				podaci.push(objekat);
			}
		}
		db.osoblje.findAll({where: {
		      id: {[Op.notIn]:idDodatogOsoblja}
		}}).then(function (osoblje) {
			for(var i in osoblje) {
				var osobaImeIPrezime = osoblje[i].ime + " " + osoblje[i].prezime;
				var objekat = {
					osoba: osobaImeIPrezime,
					sala: "u kancelariji"
				};
				podaci.push(objekat);
			}
			res.send(podaci);
		});
    });
});

app.get('/sale', function (req, res) {
	db.sala.findAll().then(function (sale) {
		res.send(sale);
    });
});

// Unos periodicne rezervacije
app.post('/periodicna', function (req, res) {
	let tijelo = req.body;
	let dan = tijelo['dan'];
	let semestar = tijelo['semestar'];
	let pocetak = tijelo['pocetak'];
	let kraj = tijelo['kraj'];
	let naziv = tijelo['naziv'];
	let osobaId = tijelo['predavac'];
	if (!perPodaciIspravni(dan, semestar, pocetak, kraj, naziv, osobaId)) {
		res.status(400).send("Primljeni podaci nisu ispravni!");
		return;
	}
	let datumS = tijelo['datumS'];
	if (datumS != undefined)
		delete tijelo['datumS'];
	db.rezervacija.findAll({
		include: [{ model: db.termin, as: 'rezervacijaTermin', where: {[Op.or]: [{redovni: false}, {redovni: true, dan: dan, semestar: semestar}]} },
				  { model: db.sala, as: 'rezervacijaSala'},
				  { model: db.osoblje, as: 'rezervacijaOsoblje'}],
		where: {[Op.or]: [{'$rezervacijaSala.naziv$': naziv}, {'$rezervacijaOsoblje.id$': osobaId}]}
	}).then(function (termini) {
		for(var i in termini) {
			var pocetakR = termini[i].rezervacijaTermin.pocetak.substring(0, 5);
			var krajR = termini[i].rezervacijaTermin.kraj.substring(0, 5);
			if (nalaziSeUIntervalu(pocetak, kraj, pocetakR, krajR)) {
				var redovni = termini[i].rezervacijaTermin.redovni;
				if (!redovni) {
					let datumPer = termini[i].rezervacijaTermin.datum;
					let mjesec = vratiMjesecIzDatuma(datumPer);
					if (!vratiNizMjeseciSemestra(semestar).includes(mjesec))
						continue;
					let prviDan = vratiPrviDanMjeseca(new Date().getFullYear(), mjesec);
					let danD = vratiDanIzDatuma(datumPer);
					let danUSedmici = (prviDan + (danD % 7)) % 7;
					if (danUSedmici != dan)
						continue;
				}
				var nazivSale = termini[i].rezervacijaSala.naziv;
				if (nazivSale != naziv) {
					if (tijelo['potvrda'] != undefined)
						continue;
					if (datumS != undefined)
						res.status(428).send("Da li ste sigurni da želite rezervisati na " + datumS + "?\nVeć imate rezervaciju u sali " + nazivSale + " u ovo vrijeme.");
					else {
						let danIme = ["ponedjeljak", "utorak", "srijeda", "četvrtak", "petak", "subota", "nedjelja"];
						datumS = danIme[dan];
						res.status(428).send("Da li ste sigurni da želite rezervisati za " + semestar + " semestar, na dan " + datumS + "?\nVeć imate rezervaciju u sali " + nazivSale + " u ovo vrijeme.");
					}
					return;
				}
				var rezervisao = "\nRezervisao: " + termini[i].rezervacijaOsoblje.ime + " " + termini[i].rezervacijaOsoblje.prezime + " (" + termini[i].rezervacijaOsoblje.uloga + ")";
				if (datumS != undefined)
					res.status(409).send("Nije moguće rezervisati salu " + naziv + " za navedeni datum " + datumS + " i termin od " + pocetak + " do " + kraj + "!" + rezervisao);
				else {
					let danIme = ["ponedjeljak", "utorak", "srijeda", "četvrtak", "petak", "subota", "nedjelja"];
					datumS = danIme[dan];
					res.status(409).send("Nije moguće rezervisati salu " + naziv + " za " + semestar + " semestar, na dan " + datumS + " i termin od " + pocetak + " do " + kraj + "!" + rezervisao);
				}
				return;
			}
		}
		db.termin.create({
	        redovni: true,
	        dan: dan,
	        semestar: semestar,
	        pocetak: pocetak,
	        kraj: kraj
	    }).then(function (noviTermin) {
	        if (noviTermin) {
	        	var terminId = noviTermin.id;
	        	db.sala.findOne({where: {naziv: naziv}}).then(function (sala) {
	        		var salaId = sala.id;
	        		db.rezervacija.create({
	        			termin: terminId,
	        			sala: salaId,
	        			osoba: osobaId
	        		}).then(function (novaRezervacija) {
	        			if (novaRezervacija) {
		        			console.log("Uspješno upisana periodična rezervacija.");
							vratiSveRezervacije(res);
						} else {
				            res.status(400).send("Greška: Problem sa bazom");
				        }
	        		});
	        	});
	        } else {
	            res.status(400).send("Greška: Problem sa bazom");
	        }
	    });
    });
});

function perPodaciIspravni(dan, semestar, pocetak, kraj, naziv, predavac) {
	if (dan == undefined || semestar == undefined || pocetak == undefined || kraj == undefined || naziv == undefined || predavac == undefined)
		return false;
	var rxPatern = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
	if (!(rxPatern.test(pocetak)) || !(rxPatern.test(kraj)))
		return false;
	if (semestar != "ljetni" && semestar != "zimski")
		return false;
	if (dan < 0 || dan > 6)
		return false;
	return true;
}

// Unos vanredne rezervacije
app.post('/vanredna', function (req, res) {
	let tijelo = req.body;
	let datum = tijelo['datum'];
	let pocetak = tijelo['pocetak'];
	let kraj = tijelo['kraj'];
	let naziv = tijelo['naziv'];
	let osobaId = tijelo['predavac'];
	if (!vanrPodaciIspravni(datum, pocetak, kraj, naziv, osobaId)) {
		res.status(400).send("Primljeni podaci nisu ispravni!");
		return;
	}
	let datumS = datum.split(".").join("/");

	db.rezervacija.findAll({
		include: [{ model: db.termin, as: 'rezervacijaTermin', where: {[Op.or]: [{redovni: false, datum: datum}, {redovni: true}]} },
				  { model: db.sala, as: 'rezervacijaSala'},
				  { model: db.osoblje, as: 'rezervacijaOsoblje'}],
		where: {[Op.or]: [{'$rezervacijaSala.naziv$': naziv}, {'$rezervacijaOsoblje.id$': osobaId}]}
	}).then(function (termini) {
		for(var i in termini) {
			var pocetakR = termini[i].rezervacijaTermin.pocetak.substring(0, 5);
			var krajR = termini[i].rezervacijaTermin.kraj.substring(0, 5);
			if (nalaziSeUIntervalu(pocetak, kraj, pocetakR, krajR)) {
				var redovni = termini[i].rezervacijaTermin.redovni;
				if (redovni) {
					let mjesec = vratiMjesecIzDatuma(datum);
					let prviDan = vratiPrviDanMjeseca(new Date().getFullYear(), mjesec);
					let dan = vratiDanIzDatuma(datum);
					let danUSedmici = (prviDan + (dan % 7)) % 7;
					var danP = termini[i].rezervacijaTermin.dan;
					var semestarP = termini[i].rezervacijaTermin.semestar;
					if (!(vratiNizMjeseciSemestra(semestarP).includes(mjesec) && danP == danUSedmici)) {
						continue;
					}
				}
				var nazivSale = termini[i].rezervacijaSala.naziv;
				if (nazivSale != naziv) {
					if (tijelo['potvrda'] != undefined)
						continue;
					res.status(428).send("Da li ste sigurni da želite rezervisati na " + datumS + "?\nVeć imate rezervaciju u sali " + nazivSale + " u ovo vrijeme.");
					return;
				}
				var rezervisao = "\nRezervisao: " + termini[i].rezervacijaOsoblje.ime + " " + termini[i].rezervacijaOsoblje.prezime + " (" + termini[i].rezervacijaOsoblje.uloga + ")";
				res.status(409).send("Nije moguće rezervisati salu " + naziv + " za navedeni datum " + datumS + " i termin od " + pocetak + " do " + kraj + "!" + rezervisao);
				return;
			}
		}
		db.termin.create({
	        redovni: false,
	        datum: datum,
	        pocetak: pocetak,
	        kraj: kraj
	    }).then(function (noviTermin) {
	        if (noviTermin) {
	        	var terminId = noviTermin.id;
	        	db.sala.findOne({where: {naziv: naziv}}).then(function (sala) {
	        		var salaId = sala.id;
	        		db.rezervacija.create({
	        			termin: terminId,
	        			sala: salaId,
	        			osoba: osobaId
	        		}).then(function (novaRezervacija) {
	        			if (novaRezervacija) {
		        			console.log("Uspješno upisana vanredna rezervacija.");
							vratiSveRezervacije(res);
						} else {
				            res.status(400).send("Greška: Problem sa bazom");
				        }
	        		});
	        	});
	        } else {
	            res.status(400).send("Greška: Problem sa bazom");
	        }
	    });
    });
});

function vanrPodaciIspravni(datum, pocetak, kraj, naziv, predavac) {
	if (datum == undefined || pocetak == undefined || kraj == undefined || naziv == undefined || predavac == undefined)
		return false;
	var rxPatern = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
	if (!(rxPatern.test(pocetak)) || !(rxPatern.test(kraj)))
		return false;
	var rxPatern2 = /^(0[1-9]|1\d|2\d|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/;
	if (!(rxPatern2.test(datum)))
		return false;
	return true;
}

app.post('/vratiOsobuZaRez', function (req, res) {
	let tijelo = req.body;
	let datum = tijelo['datum'];
	let naziv = tijelo['naziv'];
	let pocetak = tijelo['pocetak'];
	let kraj = tijelo['kraj'];
	let mjesec = vratiMjesecIzDatuma(datum);
	let prviDan = vratiPrviDanMjeseca(new Date().getFullYear(), mjesec);
	let dan = vratiDanIzDatuma(datum);
	let danUSedmici = (prviDan + (dan % 7)) % 7;
	let semestar = "zimski"
	if (vratiNizMjeseciSemestra("ljetni").includes(mjesec))
		semestar = "ljetni";

	db.rezervacija.findAll({
		include: [{ model: db.termin, as: 'rezervacijaTermin', where: {[Op.or]: [{redovni: false, datum: datum}, {redovni: true, dan: danUSedmici, semestar: semestar}]} },
				  { model: db.sala, as: 'rezervacijaSala', where: {naziv: naziv}},
				  { model: db.osoblje, as: 'rezervacijaOsoblje'}]
	}).then(function (rezervacije) {
		for(var i in rezervacije) {
			var pocetakR = rezervacije[i].rezervacijaTermin.pocetak.substring(0, 5);
			var krajR = rezervacije[i].rezervacijaTermin.kraj.substring(0, 5);
			if (nalaziSeUIntervalu(pocetak, kraj, pocetakR, krajR)) {
				let ime = rezervacije[i].rezervacijaOsoblje.ime;
				let prezime = rezervacije[i].rezervacijaOsoblje.prezime;
				let uloga = rezervacije[i].rezervacijaOsoblje.uloga;
				let objekat = {
					osoba: {
						ime: ime,
						prezime: prezime,
						uloga: uloga
					},
					naziv: naziv,
					datum: datum,
					pocetak: pocetak,
					kraj: kraj
				};
				res.send(objekat);
			}
		}
    });
});

// Dobavljanje slika
app.get('/slike', function (req, res) {
	var indexStranice = req.query.indexStranice;
	var stranice = [];
	var i = indexStranice * 3 + 1;
	var url1 = "http://localhost:" + port + "/images/" + i + ".jpg";
	i++;
	var url2 = "http://localhost:" + port + "/images/" + i + ".jpg";
	i++;
	var url3 = "http://localhost:" + port + "/images/" + i + ".jpg";
	urlExists(url1, function(err, exists1) {
		urlExists(url2, function(err, exists2) {
			urlExists(url3, function(err, exists3) {
				dodajSliku(stranice, 0, exists1, url1);
				dodajSliku(stranice, 1, exists2, url2);
				dodajSliku(stranice, 2, exists3, url3);
				res.send(JSON.stringify({images: [stranice[0], stranice[1], stranice[2]]}));
			});
		});
	});
});

function dodajSliku(stranice, i, exists, url) {
	if (exists)
		stranice.push(url);
	else
		stranice.push(null);
}

// Provjera postojanja sljedece slike
app.get('/postojiSlika', function (req, res) {
	var idSlike = req.query.id;
	var url = "http://localhost:" + port + "/images/" + idSlike + ".jpg";
	urlExists(url, function(err, exists) {
		res.send({"result": exists});
	});
});

function vratiPrviDanMjeseca(godina, mjesec) {
	return (new Date(godina, mjesec, 1).getDay() || 7) - 1;
}

function vratiDanIzDatuma(datum) {
	var regex = /(\d\d)\./gm;
	return vratiBroj(regex, datum);
}

function vratiMjesecIzDatuma(datum) {
	var regex = /\.(\d\d)\./gm;
	return vratiBroj(regex, datum);
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

app.listen(port);