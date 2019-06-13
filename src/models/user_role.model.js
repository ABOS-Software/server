// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const definition = {};
module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const schema = sequelizeClient.define('user_role', definition, {
    tableName: 'user_role', underscored: true,
  });
  schema.associate = models => {
    schema.belongsTo(models.user, {onDelete: 'cascade'});
    schema.belongsTo(models.role, {onDelete: 'cascade'});

  };
  return schema;
};
