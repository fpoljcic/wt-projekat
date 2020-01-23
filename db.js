const Sequelize = require("sequelize");
const sequelize = new Sequelize("DBWT19", "root", "root", {
   host: "localhost",
   dialect: "mysql"
});
const db = {};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

// import modela
db.osoblje = sequelize.import(__dirname+'/Osoblje.js');
db.rezervacija = sequelize.import(__dirname+'/Rezervacija.js');
db.termin = sequelize.import(__dirname+'/Termin.js');
db.sala = sequelize.import(__dirname+'/Sala.js');

// relacije
db.osoblje.hasMany(db.rezervacija, {
  as:'osobljeRezervacija',
  foreignKey: 'osoba',
  sourceKey: 'id'
});

db.termin.hasOne(db.rezervacija, {
	as:'terminRezervacija',
	foreignKey: 'termin'
});

db.sala.hasMany(db.rezervacija, {
  as: 'salaRezervacija',
  foreignKey: 'sala',
  targetKey: 'id'
});

db.osoblje.hasOne(db.sala, {
	as:'osobljeSala',
	foreignKey: 'zaduzenaOsoba'
});

db.rezervacija.belongsTo(db.osoblje, {
	as:'rezervacijaOsoblje',
	foreignKey: 'osoba'
});

db.rezervacija.belongsTo(db.termin, {
  as: 'rezervacijaTermin',
  foreignKey: 'termin',
  targetKey: 'id'
});

db.rezervacija.belongsTo(db.sala, {
	as: 'rezervacijaSala',
	foreignKey: 'sala'
});

db.sala.belongsTo(db.osoblje, {
  as: 'salaOsoblje',
  foreignKey: 'zaduzenaOsoba',
  targetKey: 'id'
});

// SET PASSWORD FOR root@localhost = PASSWORD('root');

db.sequelize.sync().then(function() {
    inicializacija();
});

module.exports = db;

function inicializacija() {
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
    }], { ignoreDuplicates: true }).then(function () {
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
	    }], { ignoreDuplicates: true }).then(function () {
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
		    }], { ignoreDuplicates: true }).then(function () {
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
			    }], { ignoreDuplicates: true }).then(function () {
		    	console.log("Gotovo kreiranje tabela i ubacivanje početnih podataka!");
		    });
		    });
	    });
    });
}