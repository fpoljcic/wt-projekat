window.onload = function() {
	Pozivi.ucitajSaleOsoblja();
}

function upisiSaleOsoblje(saleOsoblje) {
	var tabela = document.getElementById("tabelaOsoblja");
	tabela.getElementsByTagName("tbody")[0].innerHTML = tabela.rows[0].innerHTML;
	for(var i in saleOsoblje) {
		var noviRed = tabela.insertRow();
		noviRed.innerHTML = "<td>" + saleOsoblje[i].osoba + "</td><td>" + saleOsoblje[i].sala + "</td>" 
	}
}

// Slanje ajax-a svakih 30 sekundi
setInterval(Pozivi.ucitajSaleOsoblja, 30000);