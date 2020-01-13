const Sequelize = require("sequelize");
const sequelize = new Sequelize("DBWT19", "root", "root", {
   host: "localhost",
   dialect: "mysql"
});
const db = {};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
db.osoblje = sequelize.import(__dirname+'/Osoblje.js');
db.rezervacija = sequelize.import(__dirname+'/Rezervacija.js');
db.termin = sequelize.import(__dirname+'/Termin.js');
db.sala = sequelize.import(__dirname+'/Sala.js');

// relacije
// Veza 1-n jedna osoba moze imati vise rezervacija
// sve osobe bi trebale imate getRezervacije i setRezervacije
db.osoblje.hasMany(db.rezervacija, {
  as:'rezervacijeOsobe',
  foreignKey: 'osoba',
  sourceKey: 'id',
  constraints: false
});

// Veze 1-1
db.termin.belongsTo(db.rezervacija, {
  as: 'terminRezervacija',
  foreignKey: 'id',
  targetKey: 'termin',
  constraints: false
});

db.sala.belongsTo(db.rezervacija, {
  as: 'salaRezervacija',
  foreignKey: 'id',
  targetKey: 'sala',
  constraints: false
});

db.osoblje.belongsTo(db.sala, {
  as: 'osobljeSala',
  foreignKey: 'id',
  targetKey: 'zaduzenaOsoba',
  constraints: false
});

// SET PASSWORD FOR root@localhost = PASSWORD('root');

// db.sequelize.sync();
db.sequelize.sync({force:true}).then(function() {
    inicializacija();
});

module.exports = db;

function inicializacija() {
	let osoblje;

	db.osoblje.bulkCreate([
	{
        id: 1,
        ime: 'Neko',
        prezime: 'Nekić',
        uloga: 'profesor'
    },
    {
        id: 2,
        ime: 'Drugi',
        prezime: 'Neko',
        uloga: 'asistent'
    },
    {
        id: 3,
        ime: 'Test',
        prezime: 'Test',
        uloga: 'asistent'
    }
    ]).then(function () {
        db.sala.bulkCreate([
		{
	        id: 1,
	        naziv: '1-11',
	        zaduzenaOsoba: 1
	    },
	    {
	        id: 2,
	        naziv: '1-15',
	        zaduzenaOsoba: 2
	    }
	    ]).then(function () {
	        db.termin.bulkCreate([
			{
		        id: 1,
		        redovni: false,
		        //dan: null,
		        datum: '01.01.2020',
		        //semestar: null,
		        pocetak: '12:00',
		        kraj: '13:00'
		    },
		    {
		        id: 2,
		        redovni: true,
		        dan: 0,
		        // datum: null,
		        semestar: 'zimski',
		        pocetak: '13:00',
		        kraj: '14:00'
		    }
		    ]).then(function () {
		        db.rezervacija.bulkCreate([
				{
			        id: 1,
			        termin: 1,
			        sala: 1,
			        osoba: 1
			    },
			    {
			        id: 2,
			        termin: 2,
			        sala: 1,
			        osoba: 3
			    }
			]).then(function () {
		    	console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
		    });
		    });
	    });
    });
}