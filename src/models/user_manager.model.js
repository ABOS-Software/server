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


};
module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const schema = sequelizeClient.define('user_manager', definition, {
    tableName: 'user_manager',
    underscored: true,
  });
  schema.associate = models => {
    schema.belongsTo(models.year, {onDelete: 'cascade'});
    schema.belongsTo(models.user, {onDelete: 'cascade'});
    schema.belongsTo(models.user, {as: 'manage',onDelete: 'cascade'});

  };
  return schema;
};
