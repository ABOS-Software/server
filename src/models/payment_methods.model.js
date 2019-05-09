// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const defintion = {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },




  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },



};
module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const schema = sequelizeClient.define('payment_methods', defintion, {
    tableName: 'payment_methods', underscored: true,
  });

  return schema;
};
