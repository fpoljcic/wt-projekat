const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const urlExists = require('url-exists');
const app = express();
const port = 8080;

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true}));

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

app.get('/ucitaj', function (req, res) {
	res.sendFile(__dirname + "/zauzeca.json");
});

app.post('/periodicna', function (req, res) {
	let tijelo = req.body;
	let dan = tijelo['dan'];
	let semestar = tijelo['semestar'];
	let pocetak = tijelo['pocetak'];
	let kraj = tijelo['kraj'];
	let naziv = tijelo['naziv'];
	let predavac = tijelo['predavac'];
	let datumS = tijelo['datumS'];
	delete tijelo['datumS'];

	fs.readFile('zauzeca.json', (err, data) => {
	    if (err) throw err;
	    let periodicnoZauzece = JSON.parse(data);
	    for (var i = 0; i < periodicnoZauzece.periodicna.length; i++) {
	    	var zauzece = periodicnoZauzece.periodicna[i];
	    	if (zauzece.dan === dan && zauzece.semestar === semestar && zauzece.naziv === naziv && nalaziSeUIntervalu(pocetak, kraj, zauzece.pocetak, zauzece.kraj)) {
	    		res.status(409).send("Nije moguće rezervisati salu " + naziv + " za navedeni datum " + datumS + " i termin od " + pocetak + " do " + kraj + "!");
	    		return;
	    	}
	    }
	    upisiRezervaciju(tijelo, res, 'periodicna');
	});
});

app.post('/vanredna', function (req, res) {
	let tijelo = req.body;
	let datum = tijelo['datum'];
	let pocetak = tijelo['pocetak'];
	let kraj = tijelo['kraj'];
	let naziv = tijelo['naziv'];
	let predavac = tijelo['predavac'];
	let datumS = tijelo['datumS'];
	delete tijelo['datumS'];

	fs.readFile('zauzeca.json', (err, data) => {
	    if (err) throw err;
	    let vanrednoZauzece = JSON.parse(data);
	    for (var i = 0; i < vanrednoZauzece.vanredna.length; i++) {
	    	var zauzece = vanrednoZauzece.vanredna[i];
	    	if (zauzece.datum === datum && zauzece.naziv === naziv && nalaziSeUIntervalu(pocetak, kraj, zauzece.pocetak, zauzece.kraj)) {
	    		res.status(409).send("Nije moguće rezervisati salu " + naziv + " za navedeni datum " + datumS + " i termin od " + pocetak + " do " + kraj + "!");
	    		return;
	    	}
	    }
	    upisiRezervaciju(tijelo, res, 'vanredna');
	});
});

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

app.get('/postojiSlika', function (req, res) {
	var idSlike = req.query.id;
	var url = "http://localhost:" + port + "/images/" + idSlike + ".jpg";
	urlExists(url, function(err, exists) {
		res.send({"result": exists});
	});
});

function upisiRezervaciju(tijelo, res, tip) {
	fs.readFile('zauzeca.json', function (err, data) {
	    var json = JSON.parse(data);
	    json[tip].push(tijelo);
	    fs.writeFile("zauzeca.json", JSON.stringify(json), function(err) {
		    if(err) {
		        return console.log(err);
		    }
		    console.log("Uspješno upisana " + tip + " rezervacija.");
	    	res.send(json);
		}); 
	});
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