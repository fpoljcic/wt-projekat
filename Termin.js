const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const Termin = sequelize.define('termin', {
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      redovni: Sequelize.BOOLEAN,
      dan: Sequelize.INTEGER,
      datum: Sequelize.STRING,
      semestar: Sequelize.INTEGER,
      pocetak: Sequelize.TIME,
      kraj: Sequelize.TIME
   }, {
      timestamps: false,
      freezeTableName: true,
   });
   return Termin;
}