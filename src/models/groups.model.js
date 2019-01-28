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

  group_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

};
module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const schema = sequelizeClient.define('groups', definition, {
    tableName: 'groups', underscored: true,
  });
  schema.associate = models => {
    schema.belongsTo(models.year);
    schema.hasMany(models.user_year);
  };
  return schema;
};
