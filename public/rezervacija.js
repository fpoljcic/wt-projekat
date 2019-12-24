let Pozivi = (function() {
	

	function ucitajSaServeraImpl() {
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function () {
			if (ajax.readyState == 4 && ajax.status == 200) {
				var podaci = JSON.parse(ajax.responseText);
				Kalendar.ucitajPodatke(podaci.periodicna, podaci.vanredna);
			}
		}
		ajax.open("GET", "http://localhost:8080/ucitaj", true);
		ajax.send();
	}

	function ucitajPodatkeImpl(periodicnaP, vanrednaP) {
	
	}


	return {
		ucitajSaServera: ucitajSaServeraImpl,
		ucitajPodatke: ucitajPodatkeImpl
	}
}());

Pozivi.ucitajSaServera();
