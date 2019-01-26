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

  authority: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  }
};
module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const role = sequelizeClient.define('role', defintion, {
    tableName: 'role', underscored: true,
  });

  // eslint-disable-next-line no-unused-vars
  role.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return role;
};
