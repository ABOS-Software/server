// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const definition = {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  year: {
    type: DataTypes.STRING(4),
    allowNull: false,
    unique: true
  }
};
module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const year = sequelizeClient.define('year', definition, {
    tableName: 'year', underscored: true,
  });

  // eslint-disable-next-line no-unused-vars
  year.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return year;
};
