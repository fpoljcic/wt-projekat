const express = require('express');
const bodyParser = require('body-parser');
const app = express();

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

app.listen(8080);