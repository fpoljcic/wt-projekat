const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const Rezervacija = sequelize.define('rezervacija', {
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      termin: {
         type: Sequelize.INTEGER,
         unique: true,
         references: {
           model: "termin",
           key: 'id'
         }
      },
      sala: {
         type: Sequelize.INTEGER,
         references: {
           model: "sala",
           key: 'id'
         }
      },
      osoba: {
         type: Sequelize.INTEGER,
         references: {
           model: "osoblje",
           key: 'id'
         }
      }
   }, {
      timestamps: false,
      freezeTableName: true,
   });
   return Rezervacija;
}